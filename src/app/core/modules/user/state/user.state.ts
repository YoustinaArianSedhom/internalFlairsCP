import { State, Action, StateContext, Selector } from '@ngxs/store';
import {
  SetUser,
  UpdateUserProperty,
  UpdateRoles,
  GetMyProfileDetails,
  ResetUserInfo,
} from './user.actions';
import { loggedInUserModel } from '../model/user.model';
import { Injectable } from '@angular/core';
import { ProfileModel } from '../model/user.model';
import { UserService } from '../model/user.service';
import { tap } from 'rxjs/operators';
import { SystemRoles } from '@core/modules/authorization/model/authorization.config';
import { SetGrantedRoles } from '@core/modules/authorization/state/authorization.actions';

export class UserStateModel {
  public user!: loggedInUserModel;
  public myProfile!: ProfileModel;

  constructor() {
    this.user = {
      id: '',
      title: '',
      fullName: '',
      profileRoles: [],
      userPermissions: [],
    };
    this.myProfile = null;
  }
}

@Injectable()
@State<UserStateModel>({
  name: 'flairs_SSA_user',
  defaults: new UserStateModel(),
})
export class UserState {
  constructor(private _userService: UserService) {}

  @Selector()
  static user(state: UserStateModel): loggedInUserModel {
    return state.user;
  }

  @Selector()
  static userRoles(state: UserStateModel): string[] {
    return state.user.profileRoles;
  }
  @Selector()
  static myProfile(state: UserStateModel): ProfileModel {
    return state.myProfile;
  }

  @Action(GetMyProfileDetails)
  public getMyProfileDetails({ patchState }: StateContext<UserStateModel>) {
    return this._userService
      .getMyProfileDetails()
      .pipe(tap((myProfile: ProfileModel) => patchState({ myProfile })));
  }

  @Action(SetUser)
  setUser(ctx: StateContext<UserStateModel>, { user }: SetUser) {
    ctx.patchState({ user: { ...user, profileRoles: [SystemRoles.Master] } });
  }

  @Action(ResetUserInfo)
  public resetUserInfo({ dispatch }: StateContext<UserStateModel>) {
    // alert("we are resetting user info")
    return this._userService
      .GetMyUserInfo()
      .pipe(
        tap((user: loggedInUserModel) =>
          dispatch([
            new SetUser({ ...user, profileRoles: [SystemRoles.Master] }),
            new SetGrantedRoles(user.roles),
          ])
        )
      );
  }

  @Action(UpdateUserProperty)
  updateUserProperty(
    ctx: StateContext<UserStateModel>,
    { property, value }: UpdateUserProperty
  ) {
    ctx.patchState({ user: { ...ctx.getState().user, [property]: value } });
  }

  @Action(UpdateRoles)
  public updateRoles(
    { patchState, getState, dispatch }: StateContext<UserStateModel>,
    { roles: profileRoles }: UpdateRoles
  ) {
    patchState({ user: { ...getState().user, profileRoles } });
  }
}
