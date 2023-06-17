import { State, Action, StateContext, Selector } from '@ngxs/store';
import {
  ShowSpinner,
  HideSpinner,
  DeactivateSpinner,
  ActivateSpinner,
  RegisterExcludedUrls,
} from './spinner.actions';
import { Injectable } from '@angular/core';

export class SpinnerStateModel {
  public enabled: boolean = false;
  public activated?: boolean;
  public loading: boolean = false;
  public excludedUrls!: string[];
}

@Injectable()
@State<SpinnerStateModel>({
  name: 'spinner',
  defaults: {
    enabled: false,
    activated: true,
    loading: true,
    excludedUrls: [
      'connect/token',
      'api/auth/GetMyUserInfo',
      'well-known/openid-configuration/jwks',
      'api/auth/GetSystemRoles',
      'api/Skill/Find',
    ],
  },
})
export class SpinnerState {
  @Selector()
  public static enabled(state: SpinnerStateModel) {
    return state.enabled;
  }
  @Selector()
  public static activated(state: SpinnerStateModel) {
    return state.activated;
  }

  @Selector()
  public static excludedUrls(state: SpinnerStateModel): string[] {
    return state.excludedUrls;
  }

  @Selector()
  public static loading(state: SpinnerStateModel): boolean {
    return state.loading;
  }

  @Action(ShowSpinner)
  show(ctx: StateContext<SpinnerStateModel>) {
    ctx.patchState({ enabled: true, loading: true });
  }

  @Action(HideSpinner)
  hide(ctx: StateContext<SpinnerStateModel>) {
    ctx.patchState({ enabled: false, loading: false });
  }

  @Action(DeactivateSpinner)
  deActivate(ctx: StateContext<SpinnerStateModel>) {
    ctx.patchState({ activated: false });
  }

  @Action(ActivateSpinner)
  activate(ctx: StateContext<SpinnerStateModel>) {
    ctx.patchState({ activated: true });
  }

  @Action(RegisterExcludedUrls)
  public registerExcludedUrls(
    ctx: StateContext<SpinnerStateModel>,
    { excludedUrls }: RegisterExcludedUrls
  ) {
    ctx.patchState({
      excludedUrls: [
        ...new Set([...ctx.getState().excludedUrls, ...excludedUrls]),
      ],
    });
  }
}
