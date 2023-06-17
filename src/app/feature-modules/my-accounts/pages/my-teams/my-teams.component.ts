import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MyTeamsState } from '@modules/my-accounts/state/my-accounts.state';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select, Store } from '@ngxs/store';
import { BasicSelectConfigModel } from '@shared/modules/selects/model/selects.model';
import * as MY_TASKS_CONFIGS from '../../models/my-accounts.config';
import * as MY_TEAMS_ACTIONS from '../../state/my-accounts.actions';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { BreakpointObserver } from '@angular/cdk/layout';
import { HeadRefresherType } from '@core/services/head-refresher/head-refresher.models';
import { HeadRefresherService } from '@core/services/head-refresher/head-refresher.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import * as MY_TASKS_MODELS from '../../models/my-accounts.model';
import { RequestTeamModel } from '../../models/my-accounts.model';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ModalMyTeamsComponent } from '@modules/my-accounts/components/modal-my-teams/modal-my-teams.component';
import * as PROFILE_ACTION from '@modules/profiles/state/profiles.actions';

@Component({
  selector: 'customerPortal-my-teams',
  templateUrl: './my-teams.component.html',
  styleUrls: ['./my-teams.component.scss'],
})
export class MyTeamsComponent implements OnInit, OnDestroy, HeadRefresherType {
  
  public isSkillsSelected:boolean = false;
  public isPortfolioSelected:boolean = false;
  public isTeamsSelected:boolean = false;
  public isStatusSelected:boolean = false;

  constructor(
    private _store: Store,
    private _breakpointsObserver: BreakpointObserver,
    private _headRefresher: HeadRefresherService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  @ViewSelectSnapshot(MyTeamsState.searchQuery) public searchQuery: string;

  @Select(MyTeamsState.portfolios) public portfolios$: Observable<
    MY_TASKS_MODELS.AssignedPortfolios[]
  >;

  @Select(MyTeamsState.skills)
  public skills$: Observable<MY_TASKS_MODELS.Skill>;

  @Select(MyTeamsState.filtrationSkills)
  public skillsSelected$: Observable<number>;

  @Select(MyTeamsState.teams) public teams$: Observable<
    MY_TASKS_MODELS.AssignedPortfolios[]
  >;

  @ViewSelectSnapshot(MyTeamsState.teams)
  public teamsFromState: MY_TASKS_MODELS.AssignedPortfolios[];

  public headInformation = {
    title: 'My Accounts',
  };

  public clientID: string;
  public PortfolioID: string;
  public teamID: string;
  public search: string;
  public status: number;
  public resetSearch = false;

  /*_______________Task status filtration configs__________________*/

  public Skills;
  public SkillsConfig: BasicSelectConfigModel = {
    placeholder: 'All',
    multiple: true,
    value: this._store.selectSnapshot(MyTeamsState.filtration).state ?? '',
  };

  public teamsPortfolio;
  public taskPortfolioSelectConfig: BasicSelectConfigModel = {
    placeholder: 'All',
    multiple: false,
    value: this._store.selectSnapshot(MyTeamsState.filtration).state ?? '',
  };

  public teams;
  public teamskSelectConfig: BasicSelectConfigModel = {
    placeholder: 'All',
    multiple: false,
    value: '',
  };

  public teamsStatusOptions = MY_TASKS_CONFIGS.TEAMS_STATUS_OPTIONS;
  public teamsStatusSelectConfig: BasicSelectConfigModel = {
    placeholder: '',
    multiple: false,
    value: this._store.selectSnapshot(MyTeamsState.filtration).state ?? 1,
  };

  isMobile: boolean;
  teamChanged: string;
  teamdIDS: any[];
  onPageInit: boolean = true;

  ngOnInit(): void {
    // this.resetSearch();
    this.getSkills();
    this.skills$.subscribe((data) => (this.Skills = data));
    this.route.params.subscribe((params: Params) => {
      this.resetFiltersAndPagination();
      this.clientID = params['clientId'];
      this.fireGetMyAssignedPortfolios(this.clientID);
      this.teamChanged = this.clientID;
      this.taskPortfolioSelectConfig = {
        ...this.taskPortfolioSelectConfig,
        value: '',
      };
      this.teamskSelectConfig = {
        ...this.teamskSelectConfig,
        value: '',
      };
      this.teamsStatusSelectConfig = {
        ...this.teamsStatusSelectConfig,
        value: 1,
      };
    });
    this.isMobile = this._breakpointsObserver.isMatched('(max-width: 768px)');
    this.refreshHeadInformation();
  }

  public refreshHeadInformation(): void {
    this._headRefresher.refresh(this.headInformation);
  }

  public fireModal(event) {
    // console.log('id', event);
    const dialogRef = this.dialog.open(ModalMyTeamsComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('The dialog was closed');
    });
  }

  ngOnDestroy() {
    this.resetFiltersAndPagination();
    let randomNumber;

    // this.fireSearchMyTeamsBySearch(''); // That's because QA want us to not cache the search results whenever we navigate to another page
  }

  resetFilter() {
    
      this.resetFiltersAndFireTable();
      this.teamChanged = '' + Math.floor(Math.random() * 1000);
      this.taskPortfolioSelectConfig = {
        ...this.taskPortfolioSelectConfig,
        value: '',
      };
      this.teamskSelectConfig = {
        ...this.teamskSelectConfig,
        value: '',
      };
      this.teamsStatusSelectConfig = {
        ...this.teamsStatusSelectConfig,
        value: 1,
      };
      this.resetSearch = !this.resetSearch;

      this.isPortfolioSelected = false;
      this.isSkillsSelected = false;
      this.isStatusSelected = false;
      this.isTeamsSelected = false;
    
  }

  @Dispatch() public setClientId(clientId: string) {
    return new MY_TEAMS_ACTIONS.setClientId(clientId);
  }

  @Dispatch() public fireGetMyAssignedPortfolios(clientID: string) {
    return new MY_TEAMS_ACTIONS.GetAssignedPortfolios(clientID);
  }

  @Dispatch() public resetFiltersAndPagination() {
    return new MY_TEAMS_ACTIONS.resetFiltersAndPagination();
  }

  @Dispatch() public getSkills() {
    return new PROFILE_ACTION.getSkills('');
  }

  @Dispatch() public resetFiltersAndFireTable() {
    return [
      new MY_TEAMS_ACTIONS.resetFiltersAndPagination(),
      new MY_TEAMS_ACTIONS.GetAssignedTeams(this.clientID, undefined),
    ];
  }

  @Dispatch() public fireGetMyAssignedTeams(
    clientID: string,
    portfolioId: string
  ) {
    return new MY_TEAMS_ACTIONS.GetAssignedTeams(clientID, portfolioId);
  }

  @Dispatch() public fireFilterByPortfolio(portfolioID: number) {
    this.isPortfolioSelected = portfolioID === -1 ? false : true;
    this.teamskSelectConfig = { ...this.teamskSelectConfig, value: '' };
    this.taskPortfolioSelectConfig = { ...this.taskPortfolioSelectConfig, value: portfolioID ===-1 ? '' : portfolioID };
    this.isTeamsSelected = false;

    this.PortfolioID = portfolioID.toString(2);
    if (this.PortfolioID === '' || portfolioID === -1) {
      this.PortfolioID = undefined;
    }
    this.teamID = undefined;
    return new MY_TEAMS_ACTIONS.GetAssignedTeams(this.clientID, this.PortfolioID);
   
  }

  @Dispatch() public fireFilterByTeams(TeamID: number|string) {
    this.teamID = TeamID.toString(2);
    this.isTeamsSelected = this.teamID === '' ? false : true;
    this.teamskSelectConfig = {...this.teamskSelectConfig,value:this.teamID}
    if (this.teamID === '') {
      // let allTeams = this.teams.slice(1);
      let allTeams = this.teamsFromState
        .filter((x) => x.id != '')
        .map((team) => team.id);
      return [
        new MY_TEAMS_ACTIONS.setFilters({
          platformsIds: allTeams,
        }),
        new MY_TEAMS_ACTIONS.FilterMyTeams(),
      ];
    } else {
      return [
        new MY_TEAMS_ACTIONS.setFilters({
          platformsIds: [this.teamID],
        }),
        new MY_TEAMS_ACTIONS.FilterMyTeams(),
      ];
    }
  }

  @Dispatch() public fireSearchMyTeamsBySearch(searchQuery: string) {
    // console.log(searchQuery);
    this.search = searchQuery;
    const payload: RequestTeamModel = {
      searchQuery,
    };
    return [
      new MY_TEAMS_ACTIONS.setFilters(payload),
      new MY_TEAMS_ACTIONS.FilterMyTeams(),
    ];
  }

  @Dispatch() public fireFilterByStatus(id: number) {
    let statusID = id;
    this.isStatusSelected = statusID === -5 ? false : true;
    this.teamsStatusSelectConfig = {...this.teamsStatusSelectConfig,value:statusID}
    if (id === -5) {
      statusID = undefined;
    }
    return [
      new MY_TEAMS_ACTIONS.setFilters({
        status: statusID,
      }),
      new MY_TEAMS_ACTIONS.FilterMyTeams(),
    ];
  }

  @Dispatch() public fireFilterBySkills(skills) {
    this.isSkillsSelected = skills && skills.length > 0 ? true : false;
    // if (!this.onPageInit) {
    return [
      new MY_TEAMS_ACTIONS.setFilters({
        skillsIds: skills,
      }),
      new MY_TEAMS_ACTIONS.FilterMyTeams(),
    ];
    // }
    // this.onPageInit = false;
  }
}
