import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MyTeamsState } from '@modules/my-accounts/state/my-accounts.state';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select, Store } from '@ngxs/store';
import { BasicSelectConfigModel } from '@shared/modules/selects/model/selects.model';
import * as PORTFOLIO_CONFIGS from '../../models/profiles.config';
import * as PORTFOLIO_MODELS from '../../models/profiles.model';
import * as PORTFOLIO_ACTIONS from '../../state/profiles.actions';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { BreakpointObserver } from '@angular/cdk/layout';
import { HeadRefresherType } from '@core/services/head-refresher/head-refresher.models';
import { HeadRefresherService } from '@core/services/head-refresher/head-refresher.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import {
  MatDialog,
} from '@angular/material/dialog';
import { ProfileState } from '@modules/profiles/state/profiles.state';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class ProfilesComponent implements OnInit, OnDestroy, HeadRefresherType {

  @ViewSelectSnapshot(MyTeamsState.searchQuery) public searchQuery: string;
  @Select(ProfileState.skills)
  public skills$: Observable<PORTFOLIO_MODELS.Skill>;

  @Select(ProfileState.filtrationSkills)
  public skillsSelected$: Observable<number>;

  public headInformation = {
    title: 'Profiles',
  };

  public isMobile: boolean;
  public cliendID: string;
  public PortfolioID: string;
  public teamID: string;
  public search: string;
  public status: number;
  public resetSearch = false;
  public isSkillsSelected = false;
  public isTypelSelected = false;
  public isAssignmentSelected = false;

  public SkillsType;
  public SkillsTypeConfig: BasicSelectConfigModel = {
    placeholder: 'All',
    multiple: true,
    value: '',
  };

  public ProfileType = PORTFOLIO_CONFIGS.PROFILE_TYPE;
  public ProfileTypeConfig: BasicSelectConfigModel = {
    placeholder: 'All',
    multiple: false,
    value: 2,
  };

  public ProfileAssignment = PORTFOLIO_CONFIGS.ASSIGNMENT_TYPE;
  public ProfileAssignmentConfig: BasicSelectConfigModel = {
    placeholder: 'All',
    multiple: false,
    value: 2,
  };


  constructor(
    private _store: Store,
    private _breakpointsObserver: BreakpointObserver,
    private _headRefresher: HeadRefresherService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  @Dispatch() public getSkills(query: string) {
    return new PORTFOLIO_ACTIONS.getSkills(query);
  }

  @Dispatch() public resetFiltersAndPagination() {
    return new PORTFOLIO_ACTIONS.resetFiltersAndPagination();
  }

  @Dispatch() public resetFiltersAndFireTable() {
    return [
      new PORTFOLIO_ACTIONS.resetFilters(),
      new PORTFOLIO_ACTIONS.FilterProfiles(),
    ];
  }

  @Dispatch() public fireFilterByType(portfolioTypeID: any) {
    this.isTypelSelected = portfolioTypeID === this.ProfileType[0].id ? false : true;
    this.ProfileTypeConfig = {...this.ProfileTypeConfig,value:portfolioTypeID};
    return [
      new PORTFOLIO_ACTIONS.setFilters({
        profileTypeFilter: portfolioTypeID,
      }),
      new PORTFOLIO_ACTIONS.FilterProfiles(),
    ];
  }

  @Dispatch() public fireFilterByAssignment(portfolioAssignmentID: any) {
    this.isAssignmentSelected = portfolioAssignmentID === '' ? false : true;
    this.ProfileAssignmentConfig = {...this.ProfileAssignmentConfig,value:portfolioAssignmentID};
    if (portfolioAssignmentID === '') {
      portfolioAssignmentID = undefined;
    }
    return [
      new PORTFOLIO_ACTIONS.setFilters({
        profileAssignFilter: portfolioAssignmentID,
      }),
      new PORTFOLIO_ACTIONS.FilterProfiles(),
    ];
  }

  @Dispatch() public fireSearchMyTeamsBySearch(searchQuery: string) {
    return [
      new PORTFOLIO_ACTIONS.setFilters({
        searchQuery,
      }),
      new PORTFOLIO_ACTIONS.FilterProfiles(),
    ];
  }

  @Dispatch() public fireFilterBySkills(data: any) {
    this.isSkillsSelected = data && data.length > 0 ? true : false;
    return [
      new PORTFOLIO_ACTIONS.setFilters({
        skillsIds: data,
      }),
      new PORTFOLIO_ACTIONS.FilterProfiles(),
    ];
  }

  @Dispatch() private _fireProfilesTable() {
    return new PORTFOLIO_ACTIONS.getProfiles({});
  }





  ngOnInit(): void {
    this.skills$.subscribe((data: any) => (this.SkillsType = data));
    this.route.params.subscribe(
      (params: Params) => (this.cliendID = params.clientId)
    );
    this.isMobile = this._breakpointsObserver.isMatched('(max-width: 768px)');
    this.refreshHeadInformation();
    this.getSkills('');
  }

  resetFilter() {
   
      this.resetFiltersAndFireTable();
      this.resetSearch = !this.resetSearch;

      this.isSkillsSelected = false;
      this.isAssignmentSelected = false;
      this.isTypelSelected = false;

      this.ProfileTypeConfig = {...this.ProfileTypeConfig,value:''};
      this.ProfileAssignmentConfig = {...this.ProfileAssignmentConfig,value:''};
    
  }

  public refreshHeadInformation(): void {
    this._headRefresher.refresh(this.headInformation);
  }

  public fireSearchInSkills(query: string) {
    this.getSkills(query);
  }

  ngOnDestroy() {
    this.resetFiltersAndPagination();
  }

  public selectionChange($event: any) {
    // console.log('selectionChange', $event);
  }
}
