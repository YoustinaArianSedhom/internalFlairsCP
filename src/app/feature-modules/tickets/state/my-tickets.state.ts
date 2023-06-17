import { Injectable } from '@angular/core';
import { PaginationModel } from '@core/http/apis.model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { TableColumnSortModel } from '@shared/modules/tables/model/tables.model';
import { tap } from 'rxjs/operators';
import { SSAConfigInst } from 'src/app/config/app.config';
import * as MY_TASKS_MODELS from '../models/my-tickets.model';
import * as MY_TASKS_CONFIG from '../models/my-tickets.config';
import { MyTicketsService } from '../models/my-tickets.service';
import * as MY_TASKS_ACTIONS from './my-tickets.actions';
import { GetMyTickets } from './my-tickets.actions';

export class MyTicketsStateModel {
  public mode: string;
  public myTickets: MY_TASKS_MODELS.MyTicketModel[];
  public myInternalTickets: MY_TASKS_MODELS.MyTicketModel[];
  public contacts: MY_TASKS_MODELS.contactModel[];
  public roles: MY_TASKS_MODELS.roleModel[];
  public Skills: MY_TASKS_MODELS.Skill[];
  public pagination: PaginationConfigModel;
  public filtration: MY_TASKS_MODELS.RequestTeamModel;
  public searchQuery: string;
  public sort: TableColumnSortModel;
  public clients: MY_TASKS_MODELS.Client[];
  public portfolios: MY_TASKS_MODELS.AssignedPortfolios[];
  public teams: MY_TASKS_MODELS.MyTicketModel[];
  public SelectedPortfolio: string;
  public firstClient: string;
  public firstPortfolio: string;
  public firstClientPortfolio: string;

  constructor() {
    this.mode = null;
    this.myTickets = null;
    this.myInternalTickets = null;
    this.Skills = null;
    this.contacts = null;
    this.roles = null;
    this.clients = null;
    this.portfolios = null;
    this.SelectedPortfolio = null;
    this.firstClient = null;
    this.firstPortfolio = null;
    this.firstClientPortfolio = null;
    this.teams = null;
    this.pagination = {
      pageSize: 10,
    };
    this.filtration = {};
    this.searchQuery = '';
    this.sort = {
      sortField: 1,
      sortType: SSAConfigInst.CRUD_CONFIG.sort.desc,
    };
  }
}
/*_______________________________DEFINING STATE__________________________________*/
@Injectable()
@State<MyTicketsStateModel>({
  name: 'myTickets',
  defaults: new MyTicketsStateModel(),
})
export class MyTicketsState {
  constructor(private _mainService: MyTicketsService) {}

  /*__________________________________________SELECTORS___________________________________*/

  @Selector() static mode(state: MyTicketsStateModel): string {
    return state.mode;
  }

  @Selector() static portfolios(
    state: MyTicketsStateModel
  ): MY_TASKS_MODELS.AssignedPortfolios[] {
    return state.portfolios;
  }

  @Selector() static selectedPortfolio(state: MyTicketsStateModel): string {
    return state.SelectedPortfolio;
  }

  @Selector() static firstClient(state: MyTicketsStateModel): string {
    return state.firstClient;
  }

  @Selector() static firstPortfolio(state: MyTicketsStateModel): string {
    return state.firstPortfolio;
  }

  @Selector() static firstClientPortfolio(state: MyTicketsStateModel): string {
    return state.firstClientPortfolio;
  }

  @Selector() static client(state: MyTicketsStateModel): string {
    return state.filtration.accountId;
  }

  @Selector() static clients(
    state: MyTicketsStateModel
  ): MY_TASKS_MODELS.Client[] {
    return state.clients;
  }

  @Selector() static skills(
    state: MyTicketsStateModel
  ): MY_TASKS_MODELS.Skill[] {
    return state.Skills;
  }

  @Selector() static teams(
    state: MyTicketsStateModel
  ): MY_TASKS_MODELS.MyTicketModel[] {
    return state.teams;
  }

  @Selector() static myTickets(
    state: MyTicketsStateModel
  ): MY_TASKS_MODELS.MyTicketModel[] {
    return state.myTickets;
  }

  @Selector() static myInternalTickets(
    state: MyTicketsStateModel
  ): MY_TASKS_MODELS.MyTicketModel[] {
    return state.myInternalTickets;
  }

  @Selector() static contacts(
    state: MyTicketsStateModel
  ): MY_TASKS_MODELS.contactModel[] {
    return state.contacts;
  }

  @Selector() static roles(
    state: MyTicketsStateModel
  ): MY_TASKS_MODELS.roleModel[] {
    return state.roles;
  }

  @Selector() static paginationConfig(
    state: MyTicketsStateModel
  ): PaginationConfigModel {
    return { ...state.pagination };
  }

  @Selector() static filtration(
    state: MyTicketsStateModel
  ): MY_TASKS_MODELS.MyTeamsFiltrationModel {
    return { ...state.filtration };
  }
  @Selector() static searchQuery(state: MyTicketsStateModel): string {
    return state.searchQuery;
  }

  /*_______________________________________REDUCERS____________________________________*/

  /*_____________Retrieve my tasks table data _____________*/

  @Action(MY_TASKS_ACTIONS.GetMyTickets)
  public getMyTickets(
    { getState, patchState }: StateContext<MyTicketsStateModel>,
    { payload }: GetMyTickets
  ) {
    const {
      pagination: { pageIndex, pageSize },
      filtration,
      searchQuery,
      sort,
    } = getState();
    return this._mainService
      .getMyTickets({ pageIndex, pageSize }, { ...payload })
      .pipe(
        tap(
          ({
            records,
            recordsTotalCount,
            totalPages,
            pageIndex,
            pageSize,
            previousPage,
          }: PaginationModel<MY_TASKS_MODELS.MyTicketModel>) => {
            patchState({
              myTickets: records,
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

  @Action(MY_TASKS_ACTIONS.GetMyInternalTickets)
  public GetMyInternalTickets(
    { getState, patchState }: StateContext<MyTicketsStateModel>,
    { payload }: GetMyTickets
  ) {
    const {
      pagination: { pageIndex, pageSize },
      filtration,
      searchQuery,
      sort,
    } = getState();
    return this._mainService
      .getMyInternalTickets({ pageIndex, pageSize }, { ...payload })
      .pipe(
        tap(
          ({
            records,
            recordsTotalCount,
            totalPages,
            pageIndex,
            pageSize,
            previousPage,
          }: PaginationModel<MY_TASKS_MODELS.MyTicketModel>) => {
            patchState({
              myInternalTickets: records,
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

  @Action(MY_TASKS_ACTIONS.GetContacts)
  public GetContacts(
    { getState, patchState }: StateContext<MyTicketsStateModel>,
    { query }: MY_TASKS_ACTIONS.GetContacts
  ) {
    // const { portfolios } = getState();
    return this._mainService.getContacts(query).pipe(
      tap((result: any) => {
        patchState({ contacts: [...result] });
      })
    );
  }

  @Action(MY_TASKS_ACTIONS.GetRoles)
  public GetRoles(
    { getState, patchState }: StateContext<MyTicketsStateModel>,
    { query }: MY_TASKS_ACTIONS.GetRoles
  ) {
    // const { portfolios } = getState();
    return this._mainService.getRoles(query).pipe(
      tap((result: any) => {
        patchState({ roles: [...result] });
      })
    );
  }

  @Action(MY_TASKS_ACTIONS.resetFilters)
  public resetFilters({
    getState,
    patchState,
  }: StateContext<MyTicketsStateModel>) {
    // const { portfolios } = getState();

    patchState({ filtration: {} });
  }

  /*__________________Pagination______________________*/

  @Action(MY_TASKS_ACTIONS.PaginateMyTeams)
  public paginateMyTasks(
    { dispatch, patchState, getState }: StateContext<MyTicketsStateModel>,
    { pagination }: MY_TASKS_ACTIONS.PaginateMyTeams
  ) {
    const state = getState();
    if (pagination.pageSize !== state.pagination.pageSize) {
      pagination.pageNumber = 0;
    }
    patchState({ pagination: { ...state.pagination, ...pagination } });
    dispatch(new MY_TASKS_ACTIONS.GetMyTickets(state.filtration));
  }

  @Action(MY_TASKS_ACTIONS.PaginateMyInternalTickets)
  public PaginateMyInternalTickets(
    { dispatch, patchState, getState }: StateContext<MyTicketsStateModel>,
    { pagination }: MY_TASKS_ACTIONS.PaginateMyTeams
  ) {
    const state = getState();
    if (pagination.pageSize !== state.pagination.pageSize) {
      pagination.pageNumber = 0;
    }
    patchState({ pagination: { ...state.pagination, ...pagination } });
    dispatch(new MY_TASKS_ACTIONS.GetMyInternalTickets(state.filtration));
  }

  @Action(MY_TASKS_ACTIONS.setClientId)
  public SetClientId(
    { dispatch, patchState, getState }: StateContext<MyTicketsStateModel>,
    { clientID }: MY_TASKS_ACTIONS.setClientId
  ) {
    const state = getState();
    patchState({ filtration: { ...state.filtration, accountId: clientID }});
  }

  @Action(MY_TASKS_ACTIONS.setMode)
  public setMode(
    { dispatch, patchState, getState }: StateContext<MyTicketsStateModel>,
    { mode }: MY_TASKS_ACTIONS.setMode
  ) {
    const state = getState();
    patchState({ mode });
  }

  @Action(MY_TASKS_ACTIONS.setFilters)
  public SetFilters(
    { dispatch, patchState, getState }: StateContext<MyTicketsStateModel>,
    { payload }: MY_TASKS_ACTIONS.setFilters
  ) {
    // console.log('statepayload', payload);
    const state = getState();
    patchState({ filtration: { ...state.filtration, ...payload } });
  }
  /*_____________________________Filtration_______________________*/

  @Action(MY_TASKS_ACTIONS.FilterMyTickets)
  public FilterMyTickets(
    { patchState, dispatch, getState }: StateContext<MyTicketsStateModel> // { filtration }: MY_TASKS_ACTIONS.FilterMyTeams
  ) {
    const state = getState();
    patchState({
      pagination: { ...getState().pagination, pageIndex: 0 }, // Don't ever forget to reset the page number to zero when you filter or search
    });
    dispatch(new MY_TASKS_ACTIONS.GetMyTickets(state.filtration));
  }

  @Action(MY_TASKS_ACTIONS.FilterMyInternalTickets)
  public FilterMyInternalTickets(
    { patchState, dispatch, getState }: StateContext<MyTicketsStateModel> // { filtration }: MY_TASKS_ACTIONS.FilterMyTeams
  ) {
    const state = getState();
    patchState({
      pagination: { ...getState().pagination, pageIndex: 0 }, // Don't ever forget to reset the page number to zero when you filter or search
    });
    dispatch(new MY_TASKS_ACTIONS.GetMyInternalTickets(state.filtration));
  }

  /*______________________Search my tasks___________________*/

  @Action(MY_TASKS_ACTIONS.SearchMyTeams)
  public SearchMyTasks(
    { patchState, getState, dispatch }: StateContext<MyTicketsStateModel>,
    { searchQuery }: MY_TASKS_ACTIONS.SearchMyTeams
  ) {
    patchState({
      searchQuery,
      pagination: { ...getState().pagination, pageNumber: 0 },
    });
    // dispatch(new MY_TASKS_ACTIONS.GetMyTeams());
  }

  @Action(MY_TASKS_ACTIONS.getAllClients)
  public getAllClients({
    patchState,
    getState,
    dispatch,
  }: StateContext<MyTicketsStateModel>) {
    return this._mainService.getMyAllowedClients().pipe(
      tap((data: any) => {
        patchState({ clients: data,firstClient:data[0].id  });
        dispatch([
          new MY_TASKS_ACTIONS.setClientId(data[0].id),
          new MY_TASKS_ACTIONS.getAllPortfolios(data[0].id),
        ]);
      })
    );
  }

  @Action(MY_TASKS_ACTIONS.getAllPortfolios)
  public getAllPortfolios(
    { patchState, getState, dispatch }: StateContext<MyTicketsStateModel>,
    { clientId }: MY_TASKS_ACTIONS.getAllPortfolios
  ) {
    const state = getState();
    return this._mainService.getMyAllowedPortfolios(clientId).pipe(
      tap((data: any) => {
        let firstPortfolioId;
        data.length
          ? (firstPortfolioId = data[0].id)
          : (firstPortfolioId = null);
        patchState({
          portfolios: data,
          SelectedPortfolio: firstPortfolioId,
          firstClientPortfolio: firstPortfolioId,
          firstPortfolio: state.firstPortfolio ? state.firstPortfolio : firstPortfolioId
        });
        if (state.mode === 'External') {
          dispatch([
            new MY_TASKS_ACTIONS.setFilters({
              portfolioId: firstPortfolioId,
            }),
            new MY_TASKS_ACTIONS.FilterMyTickets(),
          ]);
        } else if (state.mode === 'Internal') {
          dispatch([
            new MY_TASKS_ACTIONS.setFilters({
              portfolioId: firstPortfolioId,
            }),
            new MY_TASKS_ACTIONS.FilterMyInternalTickets(),
          ]);
        }
      })
    );
  }

  @Action(MY_TASKS_ACTIONS.getSkills)
  public getSkills(
    { patchState, getState, dispatch }: StateContext<MyTicketsStateModel>,
    { query }: MY_TASKS_ACTIONS.getSkills
  ) {
    return this._mainService
      .getSkills(query)
      .pipe(tap((data: any) => patchState({ Skills: data })));
  }

  @Action(MY_TASKS_ACTIONS.SortMyTeams)
  public sortMyRequests(
    { patchState, dispatch }: StateContext<MyTicketsStateModel>,
    { sort }: MY_TASKS_ACTIONS.SortMyTeams
  ) {
    patchState({
      sort,
    });
    // dispatch(new MY_TASKS_ACTIONS.GetMyTeams());
  }

  @Action(MY_TASKS_ACTIONS.resetFiltersAndPagination)
  public resetFiltersAndPagination({
    patchState,
    dispatch,
    getState,
  }: StateContext<MyTicketsStateModel>) {
    const state = getState();
    console.log(state.filtration);
    patchState({
      pagination: { pageSize: 10 },
      filtration: {
        ...state.filtration,
        searchQuery: undefined,
        contactName: undefined,
        role: undefined,
      },
    });
    // dispatch(new MY_TASKS_ACTIONS.GetMyTeams());
  }

  /*_________________take an action______________________*/

  @Action(MY_TASKS_ACTIONS.TakeActionOnTeam)
  public takeActionOnTask(
    { dispatch }: StateContext<MyTicketsStateModel>,
    { takeActionsParams }: MY_TASKS_ACTIONS.TakeActionOnTeam
  ) {
    return this._mainService.takeAction(takeActionsParams).pipe(
      tap((res) => {
        // dispatch(new MY_TASKS_ACTIONS.GetMyTeams());
      })
    );
  }

  @Action(MY_TASKS_ACTIONS.setSelectedPortfolioId)
  public setSelectedPortfolioId(
    { dispatch, setState, patchState }: StateContext<MyTicketsStateModel>,
    { id }: MY_TASKS_ACTIONS.setSelectedPortfolioId
  ) {
    patchState({ SelectedPortfolio: id });
  }
}
