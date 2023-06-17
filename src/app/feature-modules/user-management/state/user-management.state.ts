import { Injectable } from '@angular/core';
import { PaginationModel } from '@core/http/apis.model';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { insertItem, patch, updateItem } from '@ngxs/store/operators';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { tap } from 'rxjs/operators';
import { SSAConfigInst } from 'src/app/config/app.config';
import * as USER_MANAGEMENT_MODELS from '../model/user-management.models';
import { UserManagementService } from '../model/user-management.service';
import * as USER_MANAGEMENT_ACTIONS from './user-management.actions';

export class UserManagementStateModel {
  public users: USER_MANAGEMENT_MODELS.UserModel[];
  public pagination: PaginationConfigModel;
  public searchQuery: string;

  constructor() {
    this.users = [];
    this.pagination = {}
    this.searchQuery = '';
  }
}


@Injectable()
@State<UserManagementStateModel>({
  name: 'userManagement',
  defaults: new UserManagementStateModel()
})
export class UserManagementState {

  constructor(public _mainService: UserManagementService) {}



  /* _________________________ SELECTORS __________________________*/
  @Selector() static users(state: UserManagementStateModel): USER_MANAGEMENT_MODELS.UserModel[] { return state.users} 
  @Selector() static pagination(state: UserManagementStateModel): PaginationConfigModel { return {...state.pagination}} 
  @Selector() static searchQuery(state: UserManagementStateModel): string { return state.searchQuery} 







  /* _________________________ Reducers __________________________*/
  @Action(USER_MANAGEMENT_ACTIONS.GetUsers)
  public getUsers({patchState, getState}: StateContext<UserManagementStateModel>) {
    const {pagination, searchQuery} = getState();
    return this._mainService.getUsers(pagination, {searchQuery}).pipe(
      tap(({records: users, recordsTotalCount, totalPages, pageNumber, pageSize}: PaginationModel<USER_MANAGEMENT_MODELS.UserModel>) => patchState({
        users,
        pagination: {recordsTotalCount, totalPages, pageNumber, pageSize}
      }))
    )
  }


  @Action(USER_MANAGEMENT_ACTIONS.PaginateUsers)
  public paginateUsers({patchState, dispatch}: StateContext<UserManagementStateModel>, {pagination}: USER_MANAGEMENT_ACTIONS.PaginateUsers) {
    patchState({pagination})
    dispatch(new USER_MANAGEMENT_ACTIONS.GetUsers())
  }


  @Action(USER_MANAGEMENT_ACTIONS.SearchUsers)
  public searchUsers({patchState, getState, dispatch}: StateContext<UserManagementStateModel>, {searchQuery}: USER_MANAGEMENT_ACTIONS.SearchUsers) {
    patchState({searchQuery, pagination: {...getState().pagination, pageNumber: 0}});
    dispatch(new USER_MANAGEMENT_ACTIONS.GetUsers())
  }


  @Action(USER_MANAGEMENT_ACTIONS.UpdateUserPermissions)
  public updateUserPermissions({setState}: StateContext<UserManagementStateModel>, {body}: USER_MANAGEMENT_ACTIONS.UpdateUserPermissions) {
    return this._mainService.updateUserPermissions(body).pipe(
      tap((user: USER_MANAGEMENT_MODELS.UserModel) => setState(patch({
        users: updateItem<USER_MANAGEMENT_MODELS.UserModel>(item => item.id == user.id, user)
      })))
    )
  }

}
