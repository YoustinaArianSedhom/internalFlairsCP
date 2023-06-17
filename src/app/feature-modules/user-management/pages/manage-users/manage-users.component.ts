import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeadRefresherType } from '@core/services/head-refresher/head-refresher.models';
import { HeadRefresherService } from '@core/services/head-refresher/head-refresher.service';
import * as USER_MANAGEMENT_ACTIONS from '@modules/user-management/state/user-management.actions';
import { UserManagementState, UserManagementStateModel } from '@modules/user-management/state/user-management.state';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { StateOverwrite } from 'ngxs-reset-plugin';


@Component({
  selector: 'ssa-manage-users',
  templateUrl: './manage-users.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class ManageUsersComponent implements OnInit, OnDestroy, HeadRefresherType {

  constructor(
    private _breakpointsObserver: BreakpointObserver,
    private _router: Router,
    private _headRefresher: HeadRefresherService
  ) {
    this._router.navigate([{
      outlets: { 'side-panel': null }
    }])
  }
  public isMobile: boolean;

  @ViewSelectSnapshot(UserManagementState.searchQuery) public searchQuery: string;

  public headInformation = {
    title: 'Users Management'
  }

  ngOnInit(): void {

    this.refreshHeadInformation();
    // @todo move this functionality into layout service to be available cross over the system
    // and to resolve the duplication
    this.isMobile = this._breakpointsObserver.isMatched('(max-width: 768px)');
  }


  public refreshHeadInformation(): void {
    this._headRefresher.refresh(this.headInformation);
  }


  ngOnDestroy() {
    this._fireStateResetAction();
  }





  /* _____________________ Actions Fires ________________________*/
  @Dispatch() public fireSearchUsersAction(searchQuery: string) { return new USER_MANAGEMENT_ACTIONS.SearchUsers(searchQuery) }

  @Dispatch() private _fireStateResetAction() {
    return new StateOverwrite([UserManagementState, new UserManagementStateModel()])
  }
}
