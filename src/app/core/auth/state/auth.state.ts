import {
  State,
  Action,
  StateContext,
  NgxsOnInit,
  Store,
  Selector,
} from '@ngxs/store';
import * as AuthActions from './auth.actions';
import { Injectable } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { SpinnerState } from '@core/modules/spinner/state/spinner.state';
import { SSAConfigInst } from 'src/app/config/app.config';
import { UserState } from '@core/modules/user/state/user.state';
import { OAuthService } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';
import { OrganizationState } from '@core/modules/organization/state/organization.state';
import { AuthorizationState } from '@core/modules/authorization/state/authorization.state';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { OauthFailsMessages } from '../config/oauth-events.config';
import { Location } from '@angular/common';
import { ResetUserInfo } from '@core/modules/user/state/user.actions';
import { forkJoin } from 'rxjs';
import { GetMyOrganization } from '@core/modules/organization/state/organization.actions';
// import { LoadSystemRoles } from '@core/modules/authorization/state/authorization.actions';
import { of } from 'rxjs';
import { ModalsService } from '@shared/modules/modals/model/modals.service';
import {
  ActivateSpinner,
  DeactivateSpinner,
} from '@core/modules/spinner/state/spinner.actions';

export class AuthStateModel {
  logoutChannel: BroadcastChannel;
  loginChannel: BroadcastChannel;
  returnUrl?: string;
  lastDispatchedActions: object[];
  tokenRefreshInProgress: boolean;
}

@Injectable()
@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    logoutChannel: new BroadcastChannel('logout_channel'),
    loginChannel: new BroadcastChannel('login_channel'),
    lastDispatchedActions: [],
    tokenRefreshInProgress: false,
  },
})
export class AuthState implements NgxsOnInit {
  constructor(
    private readonly oauthService: OAuthService,
    private readonly _router: Router,
    private readonly _store: Store,
    private readonly _snackbar: SnackBarsService,
    private readonly _location: Location,
    private readonly _modals: ModalsService
  ) {}

  ngxsOnInit({ getState, dispatch }: StateContext<AuthStateModel>) {
    getState().logoutChannel.addEventListener('message', (e: MessageEvent) => {
      if (e.data.userHasLoggedOut) {
        getState().logoutChannel.close();
        window.location.reload();
      }
    });

    getState().loginChannel.addEventListener('message', (e: MessageEvent) => {
      if (e.data.userHasLoggedIn) {
        console.log('[AuthState] Login Message has been received successfully');
        forkJoin([
          dispatch(new ResetUserInfo()),
          dispatch(new GetMyOrganization()),
          // dispatch(new LoadSystemRoles()),
        ]).subscribe(() => {
          getState().loginChannel.close();
          window.location.reload();
        });
      }
    });
  }

  @Action(AuthActions.Login)
  public login(ctx: StateContext<AuthStateModel>, { url }: AuthActions.Login) {
    // Note: before version 9.1.0 of the library you needed to
    // call encodeURIComponent on the argument to the method.
    this.oauthService.initCodeFlow(url || this._router.url);
  }

  @Action(AuthActions.RefreshToken, {
    cancelUncompleted: true,
  })
  public refreshToken({
    getState,
    patchState,
    dispatch,
  }: StateContext<AuthStateModel>) {
    if (!getState().tokenRefreshInProgress) {
      this._modals.openFeedbackDialog({
        title: 'Renewing Session',
        content: 'Session expired, We are working on renewing it',
        status: 'success',
        autoDismissTime: 3,
      });
      dispatch(new DeactivateSpinner());
      patchState({ tokenRefreshInProgress: true });
      setTimeout(() => {
        // alert('Session Refreshing Started')
        return this.oauthService
          .refreshToken()
          .then((res) => {
            console.info('Access token has been refreshed', res);
            // Incase access token been refreshed on origin route
            if (window.location.href == window.location.origin + '/')
              window.location.href =
                window.location.origin + SSAConfigInst.ROUTES_CONFIG.root;
            const lastDispatchedActions = getState().lastDispatchedActions;
            if (lastDispatchedActions.length)
              lastDispatchedActions.forEach((action) => dispatch(action));
            patchState({
              tokenRefreshInProgress: false,
              lastDispatchedActions: [],
            });
            dispatch(new ActivateSpinner());
          })
          .catch((e) => {
            console.error(
              '[Auth State handler]' + OauthFailsMessages.failToRefresh
            );
            this._snackbar.openFailureSnackbar({
              message: OauthFailsMessages.failToRefresh,
              duration: 8,
            });
            patchState({
              tokenRefreshInProgress: false,
              lastDispatchedActions: [],
            });
            dispatch(new Navigate([SSAConfigInst.ROUTES_CONFIG.login]));
            dispatch(new ActivateSpinner());
          });
      }, 3000);
    }
    return of(null);
  }

  @Action(AuthActions.NavigateTargetRoute)
  public navigateTargetUrl(
    { dispatch, getState }: StateContext<AuthStateModel>,
    { route }: AuthActions.NavigateTargetRoute
  ) {
    dispatch(new Navigate([route ?? getState().returnUrl]));
  }

  @Action(AuthActions.Logout)
  public logout(ctx: StateContext<AuthStateModel>) {
    this._store.reset(UserState);
    this._store.reset(AuthorizationState);
    this._store.reset(OrganizationState);
    this._store.reset(SpinnerState);
    this.oauthService.logOut();
  }

  @Action(AuthActions.NotifyAllOriginContextsToLogout)
  public notifyAllOriginContextsToLogout({
    getState,
  }: StateContext<AuthStateModel>) {
    getState()?.logoutChannel.postMessage({
      userHasLoggedOut: true,
    });
  }

  @Action(AuthActions.NotifyAllOriginContextsToLogin)
  public notifyAllOriginContextsToLogin({
    getState,
  }: StateContext<AuthStateModel>) {
    console.log('[Auth state] Login message has been posted successfully');
    getState().loginChannel.postMessage({
      userHasLoggedIn: true,
    });
  }

  @Action(AuthActions.SetReturnUrl) public setReturnUrl(
    { patchState }: StateContext<AuthStateModel>,
    { route }: AuthActions.SetReturnUrl
  ) {
    patchState({ returnUrl: route || this._location.path() });
  }

  @Action(AuthActions.RemoveReturnUrl) public removeReturnUrl({
    patchState,
  }: StateContext<AuthStateModel>) {
    patchState({ returnUrl: null });
  }

  @Action(AuthActions.CacheLastDispatchedAction)
  public cacheLastDispatchedAction(
    { patchState, getState }: StateContext<AuthStateModel>,
    { action }: AuthActions.CacheLastDispatchedAction
  ) {
    patchState({
      lastDispatchedActions: [...getState().lastDispatchedActions, action],
    });
  }
}
