import { Injectable } from '@angular/core';
import { PaginationModel } from '@core/http/apis.model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { TableColumnSortModel } from '@shared/modules/tables/model/tables.model';
import { tap } from 'rxjs/operators';
import { SSAConfigInst } from 'src/app/config/app.config';
import * as MY_TEAMS_MODELS from '../models/my-accounts.model';
import * as MY_TEAMS_CONFIG from '../models/my-accounts.config';
import { MyTeamsService } from '../models/my-accounts.service';
import * as MY_TEAMS_ACTIONS from './my-accounts.actions';
import {
  GetAssignedPortfolios,
  GetMyTeams,
  GetAssignedTeams,
} from './my-accounts.actions';

export class MyAccountsStateModel {
  public myTasks: MY_TEAMS_MODELS.MyTeamModel[];
  public Skills: MY_TEAMS_MODELS.Skill[];
  public pagination: PaginationConfigModel;
  public filtration: MY_TEAMS_MODELS.RequestTeamModel;
  public searchQuery: string;
  public sort: TableColumnSortModel;
  public portfolios: MY_TEAMS_MODELS.AssignedPortfolios[];
  public teams: MY_TEAMS_MODELS.MyTeamModel[];

  constructor() {
    this.myTasks = null;
    this.Skills = null;
    this.portfolios = null;
    this.teams = null;
    this.pagination = {
      pageSize: 10,
    };
    this.filtration = {
      status: 1,
    };
    this.searchQuery = '';
    this.sort = {
      sortField: 1,
      sortType: SSAConfigInst.CRUD_CONFIG.sort.desc,
    };
  }
}
/*_______________________________DEFINING STATE__________________________________*/
@Injectable()
@State<MyAccountsStateModel>({
  name: 'myTeams',
  defaults: new MyAccountsStateModel(),
})
export class MyTeamsState {
  constructor(private _mainService: MyTeamsService) {}

  /*__________________________________________SELECTORS___________________________________*/

  @Selector() static portfolios(
    state: MyAccountsStateModel
  ): MY_TEAMS_MODELS.AssignedPortfolios[] {
    return state.portfolios;
  }

  @Selector() static skills(state: MyAccountsStateModel): MY_TEAMS_MODELS.Skill[] {
    return state.Skills;
  }

  @Selector() static teams(
    state: MyAccountsStateModel
  ): MY_TEAMS_MODELS.MyTeamModel[] {
    return state.teams;
  }

  @Selector() static myTeams(
    state: MyAccountsStateModel
  ): MY_TEAMS_MODELS.MyTeamModel[] {
    return state.myTasks;
  }

  @Selector() static paginationConfig(
    state: MyAccountsStateModel
  ): PaginationConfigModel {
    return { ...state.pagination };
  }

  @Selector() static filtration(
    state: MyAccountsStateModel
  ): MY_TEAMS_MODELS.MyTeamsFiltrationModel {
    return { ...state.filtration };
  }

  @Selector() static filtrationSkills(
    state: MyAccountsStateModel
  ): number {
    return state.filtration.skillsIds.length;
  }

  @Selector() static searchQuery(state: MyAccountsStateModel): string {
    return state.searchQuery;
  }

  /*_______________________________________REDUCERS____________________________________*/

  /*_____________Retrieve my tasks table data _____________*/

  @Action(MY_TEAMS_ACTIONS.GetMyTeams)
  public getMyTeams(
    { getState, patchState }: StateContext<MyAccountsStateModel>,
    { payload }: GetMyTeams
  ) {
    const {
      pagination: { pageIndex, pageSize },
      filtration,
      searchQuery,
      sort,
    } = getState();
    return this._mainService
      .getMyTeams({ pageIndex, pageSize }, { ...payload })
      .pipe(
        tap(
          ({
            records,
            recordsTotalCount,
            totalPages,
            pageIndex,
            pageSize,
            previousPage,
          }: PaginationModel<MY_TEAMS_MODELS.MyTeamModel>) => {
            patchState({
              myTasks: records,
              pagination: {
                recordsTotalCount,
                totalPages,
                pageIndex,
                pageSize,
                previousPageIndex: previousPage,
              },
            });
          }
        )
      );
  }

  @Action(MY_TEAMS_ACTIONS.GetAssignedPortfolios)
  public getMyAssignedPortfolios(
    { dispatch, getState, patchState }: StateContext<MyAccountsStateModel>,
    { clientId }: GetAssignedPortfolios
  ) {
    // const { portfolios } = getState();
    return this._mainService.getMyAllowedPortfolios(clientId).pipe(
      tap((result: MY_TEAMS_MODELS.AssignedPortfolios | any) => {
        const filterSchema: MY_TEAMS_MODELS.AssignedPortfolios =
          MY_TEAMS_CONFIG.filterSchema;
        patchState({ portfolios: [filterSchema, ...result] });
        dispatch(new GetAssignedTeams(clientId, undefined));
      })
    );
  }

  @Action(MY_TEAMS_ACTIONS.GetAssignedTeams)
  public getMyAssignedTeams(
    { dispatch, getState, patchState }: StateContext<MyAccountsStateModel>,
    { accountId, portfolioId }: GetAssignedTeams
  ) {
    // const { portfolios } = getState();
    return this._mainService.GetMyallowedPlatforms(accountId, portfolioId).pipe(
      tap((result: MY_TEAMS_MODELS.AssignedPortfolios | any) => {
        const filterSchema: MY_TEAMS_MODELS.AssignedPortfolios =
          MY_TEAMS_CONFIG.filterSchema;
        patchState({ teams: [filterSchema, ...result] });
        const teamsIDS = result
          .filter((x) => x.id != '')
          .map((team) => team.id);
        dispatch(new MY_TEAMS_ACTIONS.setFilters({ platformsIds: teamsIDS }));
        dispatch(new MY_TEAMS_ACTIONS.FilterMyTeams());
      })
    );
  }

  /*__________________Pagination______________________*/

  @Action(MY_TEAMS_ACTIONS.PaginateMyTeams)
  public paginateMyTasks(
    { dispatch, patchState, getState }: StateContext<MyAccountsStateModel>,
    { pagination }: MY_TEAMS_ACTIONS.PaginateMyTeams
  ) {
    const state = getState();
    if (pagination.pageSize !== state.pagination.pageSize) {
      pagination.pageIndex = 0;
    }
    patchState({ pagination: { ...state.pagination, ...pagination } });
    dispatch(new MY_TEAMS_ACTIONS.GetMyTeams(state.filtration));
  }

  @Action(MY_TEAMS_ACTIONS.setFilters)
  public SetFilters(
    { dispatch, patchState, getState }: StateContext<MyAccountsStateModel>,
    { payload }: MY_TEAMS_ACTIONS.setFilters
  ) {
    const state = getState();
    patchState({ filtration: { ...state.filtration, ...payload } });
  }

  @Action(MY_TEAMS_ACTIONS.setTeamIds)
  public setTeamIds(
    { dispatch, patchState, getState }: StateContext<MyAccountsStateModel>,
    { TeamIDS }: MY_TEAMS_ACTIONS.setTeamIds
  ) {
    const state = getState();
    patchState({ filtration: { ...state.filtration, platformsIds: TeamIDS } });
  }
  /*_____________________________Filtration_______________________*/

  @Action(MY_TEAMS_ACTIONS.FilterMyTeams)
  public FilterMyTeams(
    { patchState, dispatch, getState }: StateContext<MyAccountsStateModel> // { filtration }: MY_TEAMS_ACTIONS.FilterMyTeams
  ) {
    const state = getState();
    console.log('filtermyTeams');
    patchState({
      pagination: { ...getState().pagination, pageIndex: 0 }, // Don't ever forget to reset the page number to zero when you filter or search
    });
    dispatch(new MY_TEAMS_ACTIONS.GetMyTeams(state.filtration));
  }

  /*______________________Search my tasks___________________*/

  @Action(MY_TEAMS_ACTIONS.SearchMyTeams)
  public SearchMyTasks(
    { patchState, getState, dispatch }: StateContext<MyAccountsStateModel>,
    { searchQuery }: MY_TEAMS_ACTIONS.SearchMyTeams
  ) {
    patchState({
      searchQuery,
      pagination: { ...getState().pagination, pageIndex: 0 },
    });
    // dispatch(new MY_TEAMS_ACTIONS.GetMyTeams());
  }

  @Action(MY_TEAMS_ACTIONS.resetFiltersAndPagination)
  public resetFiltersAndPagination({
    patchState,
    getState,
    dispatch,
  }: StateContext<MyAccountsStateModel>) {
    patchState({
      pagination: { pageSize: 10 },
      filtration: { status: 1 },
    });
    // dispatch(new MY_TEAMS_ACTIONS.GetMyTeams());
  }

  @Action(MY_TEAMS_ACTIONS.getSkills)
  public getSkills(
    { patchState, getState, dispatch }: StateContext<MyAccountsStateModel>,
    { query }: MY_TEAMS_ACTIONS.getSkills
  ) {
    return this._mainService
      .getSkills(query)
      .pipe(tap((data: any) => patchState({ Skills: data })));
  }

  @Action(MY_TEAMS_ACTIONS.SortMyTeams)
  public sortMyRequests(
    { patchState, dispatch }: StateContext<MyAccountsStateModel>,
    { sort }: MY_TEAMS_ACTIONS.SortMyTeams
  ) {
    patchState({
      sort,
    });
    // dispatch(new MY_TEAMS_ACTIONS.GetMyTeams());
  }

  /*_________________take an action______________________*/

  @Action(MY_TEAMS_ACTIONS.resetSearch)
  public resetSearch(
    { dispatch, patchState }: StateContext<MyAccountsStateModel>,
    { takeActionsParams }: MY_TEAMS_ACTIONS.TakeActionOnTeam
  ) {
    patchState({ filtration: { searchQuery: '' } });
  }

  @Action(MY_TEAMS_ACTIONS.ResetTeamsAndPortfolios)
  public ResetTeamsAndPortfolios({
    dispatch,
    patchState,
  }: StateContext<MyAccountsStateModel>) {
    patchState({ teams: null, portfolios: null });
  }
}
