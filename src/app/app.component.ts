import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '@core/auth/model/auth.service';
import { CacheLastDispatchedAction } from '@core/auth/state/auth.actions';
import { SetGrantedRoles } from '@core/modules/authorization/state/authorization.actions';
import { HideSpinner } from '@core/modules/spinner/state/spinner.actions';
import { ResetUserInfo } from '@core/modules/user/state/user.actions';
import { CustomIconsService } from '@core/services/custom-icons/custom-icons.service';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Actions, Store } from '@ngxs/store';
import { filter, tap } from 'rxjs/operators';
import { SSAConfigInst } from './config/app.config';

@Component({
  selector: 'ssa-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    private _customIconService: CustomIconsService,
    private _router: Router,
    private _location: Location,
    private _authService: AuthService,
    private _actions: Actions,
    private _store: Store
  ) {
    this._unRegisterServiceWorker();
    this._authService.runInitialLoginSequence();
  }

  private _setupUserInfoSubscribe;

  ngOnInit(): void {
    // this._authService.kickingAuthFlowAndNeededSetups();
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this._customIconService.init();
    this._cacheActions();

    // Trying to skip the origin url and back again
    this._router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (!this._location.path().includes('side-panel')) this.hideLoader();
        // if (!this._location.path().includes('my-teams'))
        //   this._store.dispatch(new ResetUserInfo());
        const url = this._location.path();
        console.log(url);
        const suspendedUrls = ['/', '/index.html', '', '/auth/auto-login'];
        if (suspendedUrls.includes(url)) this._location.forward();
      });
  }

  private _cacheActions() {
    this._actions.subscribe(
      ({
        action,
        status,
        error,
      }: {
        action: object;
        status: string;
        error: HttpErrorResponse;
      }) => {
        if (error) {
          if (
            status == 'ERRORED' &&
            error.status ==
              SSAConfigInst.CRUD_CONFIG.errorsTypes.notAuthenticated
          ) {
            this._store.dispatch(new CacheLastDispatchedAction(action));
          }
        }
      }
    );
  }

  private _unRegisterServiceWorker() {
    if (window.navigator && navigator.serviceWorker) {
      navigator.serviceWorker.getRegistrations().then(function (registrations) {
        for (let registration of registrations) {
          registration.unregister();
        }
      });
    }

    if ('caches' in window) {
      caches.keys().then(function (keyList) {
        return Promise.all(
          keyList.map(function (key) {
            return caches.delete(key);
          })
        );
      });
    }
  }

  @Dispatch() public hideLoader() {
    return new HideSpinner();
  }
}
