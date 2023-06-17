import { Component, Output, OnInit, EventEmitter } from '@angular/core';
import * as USER_MANAGEMENT_MODELS from '@modules/user-management/model/user-management.models';
import { UserManagementState } from '@modules/user-management/state/user-management.state';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import * as USER_MANAGEMENT_ACTIONS from '@modules/user-management/state/user-management.actions';


@Component({
  selector: 'ssa-cards-wrapper-user-management',
  templateUrl: './cards-wrapper-user-management.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class CardWrapperUserManagementComponent implements OnInit {


  @Output() public rolesEdit: EventEmitter<boolean> = new EventEmitter();
  
  constructor() { }


  /* ___________________ SELECTS _____________________ */
  @ViewSelectSnapshot(UserManagementState.users) public users!: USER_MANAGEMENT_MODELS.UserModel[];
  @ViewSelectSnapshot(UserManagementState.pagination) public pagination!: PaginationConfigModel;

  ngOnInit(): void {
    this._fireGetUsersAction();
  }



  @Dispatch() private _fireGetUsersAction() { return new USER_MANAGEMENT_ACTIONS.GetUsers() }
  @Dispatch() public firePaginateUsersAction(pagination: PaginationConfigModel) { return new USER_MANAGEMENT_ACTIONS.PaginateUsers(pagination) }

}
