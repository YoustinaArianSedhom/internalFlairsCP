import { State, NgxsOnInit, StateContext, Selector, Action } from '@ngxs/store';
import { PermissionsListModel } from '../model/authorization.model';
import { AuthorizationService } from '../model/authorization.service';
import {
  InstallPermissions,
  // LoadSystemRoles,
  SetGrantedRoles,
} from './authorization.actions';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { SystemRoles } from '../model/authorization.config';

export class AuthorizationStateModel {
  public permissions: PermissionsListModel;
  public systemRoles: string[];
  public grantedRoles: string[];

  constructor() {
    this.permissions = {};
    this.systemRoles = [];
    this.grantedRoles = [];
  }
}

@Injectable()
@State<AuthorizationStateModel>({
  name: 'authorization',
  defaults: new AuthorizationStateModel(),
})
export class AuthorizationState implements NgxsOnInit {
  constructor(private _authorizationService: AuthorizationService) {}

  // Installing dummy permissions list for avoiding 'Accessing from undefined exception'
  ngxsOnInit(ctx: StateContext<AuthorizationStateModel>) {
    ctx.dispatch(new InstallPermissions(ctx.getState().grantedRoles));
  }

  @Selector()
  static permissions(state: AuthorizationStateModel): PermissionsListModel {
    return state.permissions;
  }

  @Selector() static systemRoles(state: AuthorizationStateModel): string[] {
    return state.systemRoles;
  }

  @Selector() static grantedRoles(state: AuthorizationStateModel): string[] {
    return state.grantedRoles;
  }

  @Selector() static isEmployee(state: AuthorizationStateModel): boolean {
    return state.grantedRoles.includes(SystemRoles.Employee);
  }

  @Selector() static isManager(state: AuthorizationStateModel): boolean {
    return state.grantedRoles.includes(SystemRoles.Manager);
  }

  @Selector() static isAdmin(state: AuthorizationStateModel): boolean {
    return state.grantedRoles.includes(SystemRoles.SuperAdmin);
  }

  @Selector() static isInternalAdmin(state: AuthorizationStateModel): boolean {
    return state.grantedRoles.includes(SystemRoles.InternalAdmin);
  }

  @Selector() static isExternalAdmin(state: AuthorizationStateModel): boolean {
    return state.grantedRoles.includes(SystemRoles.ExternalAdmin);
  }

  @Selector() static isPayrollManager(state: AuthorizationStateModel): boolean {
    return state.grantedRoles.includes(SystemRoles.PayrollManager);
  }

  @Selector() static isPermissionManagement(
    state: AuthorizationStateModel
  ): boolean {
    return state.grantedRoles.includes(SystemRoles.PermissionManagement);
  }

  @Selector() static isWorkflowManagement(
    state: AuthorizationStateModel
  ): boolean {
    return state.grantedRoles.includes(SystemRoles.workflowManagement);
  }

  /**
   * @description Set the corresponding permissions based on the granted roles of current logged in user
   */

  /**
   * @description Load all available System roles to be used in the User-Role-Form
   */
  // @Action(LoadSystemRoles)
  // public loadSystemRoles({patchState}: StateContext<AuthorizationStateModel>) {
  //   return this._authorizationService.loadSystemRoles().pipe(
  //     tap((systemRoles: string[]) => patchState({systemRoles}))
  //   )
  // }

  /**
   * @description Set the granted roles of the current logged in user to be used into the needed guards
   */
  @Action(SetGrantedRoles)
  public setGrantedRoles(
    { patchState, dispatch }: StateContext<AuthorizationStateModel>,
    { roles }: SetGrantedRoles
  ) {
    patchState({ grantedRoles: [...roles] });
    // Temporary fix for the wired behavior of firing the install permissions before set Granted roles
    setTimeout(() => {
      dispatch(new InstallPermissions(roles));
    }, 500);
  }
}
