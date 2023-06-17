import { Component, OnDestroy, OnInit } from '@angular/core';
import { HeadRefresherService } from '@core/services/head-refresher/head-refresher.service';
import { MyTeamState, MyTeamStateModel } from '@modules/my-team/state/my-team.state';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import * as MY_TEAM_ACTIONS from '../../state/my-team.action';
import * as MY_TEAM_CONFIG from '../../models/my-team.config';
import { BasicSelectConfigModel } from '@shared/modules/selects/model/selects.model';
import * as MY_TEAM_MODELS from '../../models/my-team.models';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { StateOverwrite } from 'ngxs-reset-plugin';

@Component({
  selector: 'customerPortal-manage-my-team-component',
  templateUrl: './manage-my-team-page.component.html',
  styles: [
    `
      :host {
        display: block;
      }
      :host::ng-deep .mat-checkbox-layout .mat-checkbox-label {
          font-weight: bold;
      } 
      ::ng-deep .managerMenu {
        min-width: 28.12rem !important;
      }
      ::ng-deep .managerMenu .mat-form-field {
        width: 100%;
      }
          
    `
  ]
})
export class ManageMyTeamPageComponent implements OnInit, OnDestroy {
  @Select(MyTeamState.filtrationManagers)
  public managersSelected$: Observable<number>;

  @ViewSelectSnapshot(MyTeamState.filtration)
  public filtration: MY_TEAM_MODELS.MyTeamFiltrationModel;


  public searchValue: string = null;
  public resetSearch: boolean = false;
  public isStatusSelected: boolean = false;
  public directOnly: boolean = false;
  public isCountSelected: boolean = false;
  public isManagerSelected: boolean = false;
  public selectedManagers: string[] = [];



  public headInformation = {
    title: 'My Team',
  }

  /*_______________ status filtration configs__________________*/

  public status = MY_TEAM_CONFIG.MY_TEAM_STATUS;
  public statusConfig: BasicSelectConfigModel = {
    placeholder: 'All',
    multiple: false,
    value: '',
  }

  public count = MY_TEAM_CONFIG.ASSOSIATION_COUNT;
  public associationCountConfig: BasicSelectConfigModel = {
    placeholder: 'All',
    multiple: false,
    value: '',
  }


  constructor(private _headRefresher: HeadRefresherService, private _store:Store) { }

  @Dispatch() public fireFilterMyTeamBySearchQuery(searchQuery: string) {
    return [
      new MY_TEAM_ACTIONS.SetTeamFilters({
        searchQuery,
      }),
      new MY_TEAM_ACTIONS.GetMyTeamPage(),
    ]
  }


  @Dispatch() public fireGetMyTeamPage() { return new MY_TEAM_ACTIONS.GetMyTeamPage() }

  @Dispatch() public fireFilterByStatus(statusID: any) {
    this.isStatusSelected = statusID === '' ? false : true;
    this.statusConfig = { ...this.statusConfig, value: statusID }
    if (statusID === 0) {
      statusID = false
    } else if (statusID === 1) {
      statusID = true
    } else {
      statusID = undefined
    }
    return [
      new MY_TEAM_ACTIONS.SetTeamFilters({
        assignedProfileStatus: statusID
      }),
      new MY_TEAM_ACTIONS.GetMyTeamPage(),
    ];
  }

  @Dispatch() public fireFilterBySubs(directOnly: boolean) {
    this.directOnly = directOnly;
    return [
      new MY_TEAM_ACTIONS.SetTeamFilters({
        directOnly,
      }),
      new MY_TEAM_ACTIONS.GetMyTeamPage(),
    ]
  }

  @Dispatch() public fireFilterByAssosiationCount(associationCount: any) {
    this.isCountSelected = associationCount === '' ? false : true;
    this.associationCountConfig = { ...this.associationCountConfig, value: associationCount }
    if (associationCount === '') {
      associationCount = undefined;
    }

    return [
      new MY_TEAM_ACTIONS.SetTeamFilters({
        associationCount,
      }),
      new MY_TEAM_ACTIONS.GetMyTeamPage(),
    ]

  }

  @Dispatch() public getManagers(query: string) {
    return new MY_TEAM_ACTIONS.GetManagers(query);
  }

  @Dispatch() public addManagers(managerIds: string[]) {
    this.isManagerSelected = managerIds?.length > 0 ? true : false;
    if (!managerIds) this.selectedManagers = [];
    return [
      new MY_TEAM_ACTIONS.SetTeamFilters({
        managerIds,
      }),
      new MY_TEAM_ACTIONS.GetMyTeamPage()
    ]
  }



  ngOnInit(): void {
    this.refreshHeadInformation();
    this.fireGetMyTeamPage();
    this.getManagers('');

    if (this.filtration) {
      if (this.filtration.managerIds?.length > 0) {
        this.isManagerSelected = true;
        this.selectedManagers = [...this.filtration.managerIds];
      }
    }


  }

  public refreshHeadInformation(): void {
    this._headRefresher.refresh(this.headInformation);
  }


  @Dispatch() public resetFilters() {
    this.isStatusSelected = false;
    this.isCountSelected = false;
    this.resetSearch = true;
    this.directOnly = false;
    this.isManagerSelected = false;
    this.selectedManagers = [];

    this.statusConfig = { ...this.statusConfig, value: '' }
    this.associationCountConfig = { ...this.associationCountConfig, value: '' }

    return [
      new MY_TEAM_ACTIONS.SetTeamFilters({
        searchQuery: '',
        directOnly: false,
        associationCount: null,
        assignedProfileStatus: null,
        managerIds: [],
      }),
      new MY_TEAM_ACTIONS.GetMyTeamPage()
    ]

  }
  ngOnDestroy() {
    this._store.dispatch(new StateOverwrite([MyTeamState, new MyTeamStateModel()]))
  }

}
