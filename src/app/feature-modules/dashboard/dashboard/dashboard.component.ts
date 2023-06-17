import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GetMyOrganization } from '@core/modules/organization/state/organization.actions';
import { OrganizationState } from '@core/modules/organization/state/organization.state';
import { loggedInUserModel } from '@core/modules/user/model/user.model';
import { UserState } from '@core/modules/user/state/user.state';
import {
  HeadInformationModel,
  HeadRefresherType,
} from '@core/services/head-refresher/head-refresher.models';
import { HeadRefresherService } from '@core/services/head-refresher/head-refresher.service';
import { StorageService } from '@core/services/storage/storage.service';
import { environment } from '@environments/environment';
import * as CLIENTS_ACTIONS from '@modules/organization/state/organization.actions';
import * as CLIENTS_MODELS from '@modules/organization/models/clients.models';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthorizationState } from '@core/modules/authorization/state/authorization.state';
import { OrganizationState as Organization } from '@modules/organization/state/organization.state';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, HeadRefresherType {

  @Select(OrganizationState.org) public myOrganization$: Observable<string[]>;
  @Select(UserState.user) public user: loggedInUserModel;
  @ViewSelectSnapshot(AuthorizationState.isAdmin) public isAdmin: boolean;

  @Select(AuthorizationState.isAdmin) public isAdmin$: Observable<boolean>;
  @Select(UserState.user) public user$: Observable<loggedInUserModel>;
  @ViewSelectSnapshot(Organization.Entities)
  public Entities: CLIENTS_MODELS.Entities;

  public organization: any;
  public environment: any;


  public headInformation: HeadInformationModel = {
    title: 'Dashboard',
  };



  constructor(
    private _store: Store,
    private _router: Router,
    private _storage: StorageService,
    private _headRefresher: HeadRefresherService
  ) {}

  @Dispatch() private _fireGetEntities() {
    // console.log('here');
    // return new CLIENTS_ACTIONS.getEntities();
    return new CLIENTS_ACTIONS.getEntities();
  }

  ngOnInit(): void {
    if (this._storage.get('returnURL', this._storage.SESSION_STORAGE)) {
      this._router.navigate([
        this._storage.get('returnURL', this._storage.SESSION_STORAGE),
      ]);
      this._storage.remove('returnURL', this._storage.SESSION_STORAGE);
    }
    this.isAdmin$.subscribe((admin) => {
      if (admin) {
        this._fireGetEntities();
      } else {
      }
    });

    this.environment = environment;

    this.myOrganization$.subscribe((res) => {
      if (res) this.organization = res;
      else this._store.dispatch(new GetMyOrganization());
    });
    this.refreshHeadInformation();
  }

  public refreshHeadInformation(): void {
    this._headRefresher.refresh(this.headInformation);
  }


}
