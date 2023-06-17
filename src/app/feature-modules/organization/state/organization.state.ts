import { Injectable } from '@angular/core';
import { PaginationModel } from '@core/http/apis.model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { TableColumnSortModel } from '@shared/modules/tables/model/tables.model';
import { tap } from 'rxjs/operators';
import { SSAConfigInst } from 'src/app/config/app.config';
import * as CLIENTS_MODELS from '../models/clients.models';
import * as CLIENTS_CONFIG from '../models/clients.config';
import { ClientService } from '../models/clients.service';
import * as CLIENTS_ACTIONS from './organization.actions';
import { GetMyOrganization } from '@core/modules/organization/state/organization.actions';

export class OrganizationStateModel {
  public Admins: CLIENTS_MODELS.Admin[];
  public Clients: CLIENTS_MODELS.Client[];
  public Portfolios: CLIENTS_MODELS.Portfolios[];
  public Teams: CLIENTS_MODELS.Teams[];
  public Departments: CLIENTS_MODELS.DepartmentBreadcrumb[];
  public AssignedProfiles: CLIENTS_MODELS.AssignedProfile[];
  public pagination: PaginationConfigModel;
  public Adminspagination: PaginationConfigModel;
  public portfolioPagination: PaginationConfigModel;
  public teamPagination: PaginationConfigModel;
  public AssignedprofilePagination: PaginationConfigModel;
  public filtration: CLIENTS_MODELS.Filtration;
  public Entites: CLIENTS_MODELS.Entities;
  public TableMode: number;
  public SelectedClient: CLIENTS_MODELS.Client;
  public SelectedPortfolio: CLIENTS_MODELS.Portfolios;
  public SelectedTeam: CLIENTS_MODELS.Teams;
  public SelectedDepartment: CLIENTS_MODELS.Department;

  public Tree: CLIENTS_MODELS.Tree[];

  public ClientIDS: CLIENTS_MODELS.Client[];
  public PortfolioIDS: CLIENTS_MODELS.Portfolios[];
  public TeamIDS: CLIENTS_MODELS.Teams[];

  constructor() {
    this.Admins = null;
    this.Clients = null;
    this.Portfolios = null;
    this.Teams = null;
    this.Departments = null;
    this.AssignedProfiles = null;
    this.SelectedClient = null;
    this.SelectedPortfolio = null;
    this.SelectedTeam = null;
    this.SelectedDepartment = null;

    this.Tree = null;

    this.ClientIDS = null;
    this.TeamIDS = null;
    this.PortfolioIDS = null;

    this.Entites = null;
    this.TableMode = 0;

    this.pagination = {
      pageSize: 10,
    };

    this.Adminspagination = {
      pageSize: 10,
    };

    this.teamPagination = {
      pageSize: 10,
    };

    this.portfolioPagination = {
      pageSize: 10,
    };
    this.AssignedprofilePagination = {
      pageSize: 10,
    };
    this.filtration = {};
  }
}
/*_______________________________DEFINING STATE__________________________________*/
@Injectable()
@State<OrganizationStateModel>({
  name: 'Clients',
  defaults: new OrganizationStateModel(),
})
export class OrganizationState {
  constructor(private _mainService: ClientService) {}

  /*__________________________________________SELECTORS___________________________________*/

  @Selector() static Tree(state: OrganizationStateModel): CLIENTS_MODELS.Tree[] {
    return state.Tree;
  }

  @Selector() static Admins(state: OrganizationStateModel): CLIENTS_MODELS.Admin[] {
    return state.Admins;
  }

  @Selector() static ClientIDS(
    state: OrganizationStateModel
  ): CLIENTS_MODELS.Client[] {
    return state.ClientIDS;
  }

  @Selector() static PortfoliosIDS(
    state: OrganizationStateModel
  ): CLIENTS_MODELS.Portfolios[] {
    return state.PortfolioIDS;
  }

  @Selector() static TeamIDS(state: OrganizationStateModel): CLIENTS_MODELS.Teams[] {
    return state.TeamIDS;
  }

  @Selector() static SelectedClient(
    state: OrganizationStateModel
  ): CLIENTS_MODELS.Client {
    return state.SelectedClient;
  }

  @Selector() static SelectedPortfolio(
    state: OrganizationStateModel
  ): CLIENTS_MODELS.Portfolios {
    return state.SelectedPortfolio;
  }

  @Selector() static SelectedTeam(
    state: OrganizationStateModel
  ): CLIENTS_MODELS.Teams {
    return state.SelectedTeam;
  }

  @Selector() static SelectedDepartment(
    state: OrganizationStateModel
  ): CLIENTS_MODELS.Department {
    return state.SelectedDepartment;
  }

  @Selector() static Clients(state: OrganizationStateModel): CLIENTS_MODELS.Client[] {
    return state.Clients;
  }

  @Selector() static Portfolios(
    state: OrganizationStateModel
  ): CLIENTS_MODELS.Portfolios[] {
    return state.Portfolios;
  }

  @Selector() static Teams(state: OrganizationStateModel): CLIENTS_MODELS.Teams[] {
    return state.Teams;
  }

  @Selector() static Departments(state: OrganizationStateModel): CLIENTS_MODELS.DepartmentBreadcrumb[] {
    return state.Departments;
  }

  @Selector() static AssignedProfiles(
    state: OrganizationStateModel
  ): CLIENTS_MODELS.AssignedProfile[] {
    return state.AssignedProfiles;
  }

  @Selector() static TableMode(state: OrganizationStateModel): number {
    return state.TableMode;
  }

  @Selector() static Entities(
    state: OrganizationStateModel
  ): CLIENTS_MODELS.Entities {
    return state.Entites;
  }

  @Selector() static AdminsPaginationConfig(
    state: OrganizationStateModel
  ): PaginationConfigModel {
    return { ...state.Adminspagination };
  }

  @Selector() static paginationConfig(
    state: OrganizationStateModel
  ): PaginationConfigModel {
    return { ...state.pagination };
  }

  @Selector() static portfolioPaginationConfig(
    state: OrganizationStateModel
  ): PaginationConfigModel {
    return { ...state.portfolioPagination };
  }

  @Selector() static teamPaginationConfig(
    state: OrganizationStateModel
  ): PaginationConfigModel {
    return { ...state.teamPagination };
  }

  @Selector() static assignedprofilePaginationConfig(
    state: OrganizationStateModel
  ): PaginationConfigModel {
    return { ...state.AssignedprofilePagination };
  }

  @Selector() static filtration(
    state: OrganizationStateModel
  ): CLIENTS_MODELS.Filtration {
    return { ...state.filtration };
  }

  @Selector() static SearchQuery(state: OrganizationStateModel): string {
    return state.filtration.searchQuery;
  }

  /*_______________________________________REDUCERS____________________________________*/

  /*_____________Retrieve my tasks table data _____________*/

  @Action(CLIENTS_ACTIONS.getAdmins)
  public getAdmins(
    { getState, patchState }: StateContext<OrganizationStateModel>,
    { id }: CLIENTS_ACTIONS.getAdmins
  ) {
    const {
      Adminspagination: { pageIndex, pageSize },
    } = getState();
    return this._mainService.getAdmins({ pageIndex, pageSize }, id).pipe(
      tap(
        ({
          records,
          recordsTotalCount,
          totalPages,
          pageIndex,
          pageSize,
          previousPage,
        }: PaginationModel<any>) => {
          patchState({
            Admins: [...records],
            Adminspagination: {
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

  @Action(CLIENTS_ACTIONS.getClients)
  public GetClients(
    { getState, patchState }: StateContext<OrganizationStateModel>,
    { payload }: CLIENTS_ACTIONS.getClients
  ) {
    const {
      pagination: { pageIndex, pageSize },
      filtration,
    } = getState();
    return this._mainService
      .getClients({ pageIndex, pageSize }, { ...payload })
      .pipe(
        tap(
          ({
            records,
            recordsTotalCount,
            totalPages,
            pageIndex,
            pageSize,
            previousPage,
          }: PaginationModel<CLIENTS_MODELS.Client>) => {
            patchState({
              Clients: [...records],
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

  @Action(CLIENTS_ACTIONS.getClientsIDS)
  public getClientsIDS(
    { getState, patchState }: StateContext<OrganizationStateModel>,
    { query }: CLIENTS_ACTIONS.getClientsIDS
  ) {
    const { filtration } = getState();
    return this._mainService
      .getClientsIDS(query)
      .pipe(tap((data: any) => patchState({ ClientIDS: data })));
  }

  @Action(CLIENTS_ACTIONS.getPortfoliosIDS)
  public getPortfoliosIDS(
    { getState, patchState }: StateContext<OrganizationStateModel>,
    { query }: CLIENTS_ACTIONS.getPortfoliosIDS
  ) {
    const { filtration } = getState();
    return this._mainService
      .getPortfoliosIDS(query)
      .pipe(tap((data: any) => patchState({ PortfolioIDS: data })));
  }

  @Action(CLIENTS_ACTIONS.getTeamsIDS)
  public getTeamsIDS(
    { getState, patchState }: StateContext<OrganizationStateModel>,
    { query }: CLIENTS_ACTIONS.getPortfoliosIDS
  ) {
    const { filtration } = getState();
    return this._mainService
      .getTeamsIDS(query)
      .pipe(tap((data: any) => patchState({ TeamIDS: data })));
  }

  @Action(CLIENTS_ACTIONS.getPortfolios)
  public getPortfolios(
    { getState, patchState }: StateContext<OrganizationStateModel>,
    { payload }: CLIENTS_ACTIONS.getPortfolios
  ) {
    const {
      portfolioPagination: { pageIndex, pageSize },
      filtration,
    } = getState();
    return this._mainService
      .getPortfolios({ pageIndex, pageSize }, { ...payload })
      .pipe(
        tap(
          ({
            records,
            recordsTotalCount,
            totalPages,
            pageIndex,
            pageSize,
            previousPage,
          }: PaginationModel<CLIENTS_MODELS.Portfolios>) => {
            patchState({
              Portfolios: [...records],
              filtration: {...payload},
              portfolioPagination: {
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

  @Action(CLIENTS_ACTIONS.getTeams)
  public getTeams(
    { getState, patchState }: StateContext<OrganizationStateModel>,
    { payload }: CLIENTS_ACTIONS.getTeams
  ) {
    const {
      teamPagination: { pageIndex, pageSize },
      filtration,
    } = getState();
    return this._mainService
      .getTeams({ pageIndex, pageSize }, { ...payload })
      .pipe(
        tap(
          ({
            records,
            recordsTotalCount,
            totalPages,
            pageIndex,
            pageSize,
            previousPage,
          }: PaginationModel<CLIENTS_MODELS.Teams>) => {
            patchState({
              Teams: [...records],
              teamPagination: {
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

  @Action(CLIENTS_ACTIONS.getDepartments)
  public getDepartments(
    { getState, patchState }: StateContext<OrganizationStateModel>,
  ) {
    const {
      filtration,
    } = getState();
    return this._mainService
      .getDepartments()
      .pipe(
        tap(
          (records: CLIENTS_MODELS.Department[]) => {
            patchState({
              Departments: [...records],
            });
          }
        )
      );
  }

  @Action(CLIENTS_ACTIONS.getAssignedProfilesByTeam)
  public getAssignedProfilesByTeam(
    { getState, patchState }: StateContext<OrganizationStateModel>,
    { payload }: CLIENTS_ACTIONS.getAssignedProfilesByTeam
  ) {
    const {
      pagination: { pageIndex, pageSize },
      filtration,
      SelectedClient,
      SelectedPortfolio,
      SelectedTeam,
    } = getState();
    return this._mainService
      .getAssignedProfileByTeam({ pageIndex, pageSize }, { ...payload })
      .pipe(
        tap(
          ({
            records,
            recordsTotalCount,
            totalPages,
            pageIndex,
            pageSize,
            previousPage,
          }: PaginationModel<CLIENTS_MODELS.AssignedProfile>) => {
            if (!SelectedClient && records.length) {
              patchState({
                SelectedClient: records[0].platform.portfolio.account,
                SelectedPortfolio: records[0].platform.portfolio,
                SelectedTeam: records[0].platform,
                SelectedDepartment: records[0].department,
              });
            }
            patchState({
              AssignedProfiles: [...records],
              AssignedprofilePagination: {
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

  @Action(CLIENTS_ACTIONS.setFilters)
  public SetFilters(
    { dispatch, patchState, getState }: StateContext<OrganizationStateModel>,
    { payload }: CLIENTS_ACTIONS.setFilters
  ) {
    const state = getState();
    patchState({ filtration: { ...state.filtration, ...payload } });
  }

  @Action(CLIENTS_ACTIONS.getTree)
  public getTree({ getState, patchState }: StateContext<OrganizationStateModel>) {
    // console.log('here');
    return this._mainService
      .getTree()
      .pipe(tap((data: any) => patchState({ Tree: data })));
  }

  @Action(CLIENTS_ACTIONS.PaginateClients)
  public PaginateClients(
    { dispatch, patchState, getState }: StateContext<OrganizationStateModel>,
    { pagination }: CLIENTS_ACTIONS.PaginateClients
  ) {
    const state = getState();
    if (pagination.pageSize !== state.pagination.pageSize) {
      pagination.pageIndex = 0;
    }
    patchState({ pagination: { ...state.pagination, ...pagination } });
    dispatch(new CLIENTS_ACTIONS.getClients(state.filtration));
  }

  @Action(CLIENTS_ACTIONS.resetFilters)
  public resetFilters({
    dispatch,
    patchState,
    getState,
  }: StateContext<OrganizationStateModel>) {
    const state = getState();
    patchState({
      filtration: {},
      pagination: { pageSize: 10 },
      portfolioPagination: { pageSize: 10 },
      teamPagination: { pageSize: 10 },
      AssignedprofilePagination: { pageSize: 10 },
    });
  }

  @Action(CLIENTS_ACTIONS.PaginatePortfolios)
  public PaginatePortfolios(
    { dispatch, patchState, getState }: StateContext<OrganizationStateModel>,
    { pagination }: CLIENTS_ACTIONS.PaginatePortfolios
  ) {
    const state = getState();
    if (pagination.pageSize !== state.portfolioPagination.pageSize) {
      pagination.pageIndex = 0;
    }
    patchState({
      portfolioPagination: { ...state.portfolioPagination, ...pagination },
    });
    dispatch(new CLIENTS_ACTIONS.getPortfolios(state.filtration));
  }

  @Action(CLIENTS_ACTIONS.PaginateTeams)
  public PaginateTeams(
    { dispatch, patchState, getState }: StateContext<OrganizationStateModel>,
    { pagination }: CLIENTS_ACTIONS.PaginateTeams
  ) {
    const state = getState();
    if (pagination.pageSize !== state.teamPagination.pageSize) {
      pagination.pageIndex = 0;
    }
    patchState({ teamPagination: { ...state.teamPagination, ...pagination } });
    dispatch(new CLIENTS_ACTIONS.getTeams(state.filtration));
  }

  @Action(CLIENTS_ACTIONS.PaginateAdmins)
  public PaginateAdmins(
    { dispatch, patchState, getState }: StateContext<OrganizationStateModel>,
    { pagination, id }: CLIENTS_ACTIONS.PaginateAdmins
  ) {
    const state = getState();
    if (pagination.pageSize !== state.Adminspagination.pageSize) {
      pagination.pageIndex = 0;
    }
    patchState({
      Adminspagination: { ...state.Adminspagination, ...pagination },
    });
    dispatch(new CLIENTS_ACTIONS.getAdmins(id));
  }

  @Action(CLIENTS_ACTIONS.PaginateAssignedProfiles)
  public PaginateAssignedProfiles(
    { dispatch, patchState, getState }: StateContext<OrganizationStateModel>,
    { pagination }: CLIENTS_ACTIONS.PaginateAssignedProfiles
  ) {
    const state = getState();
    if (pagination.pageSize !== state.AssignedprofilePagination.pageSize) {
      pagination.pageIndex = 0;
    }
    patchState({
      AssignedprofilePagination: {
        ...state.AssignedprofilePagination,
        ...pagination,
      },
    });
    dispatch(new CLIENTS_ACTIONS.getAssignedProfilesByTeam(state.filtration));
  }

  @Action(CLIENTS_ACTIONS.getEntities)
  public getEntities({
    dispatch,
    patchState,
    getState,
  }: StateContext<OrganizationStateModel>) {
    // console.log('here2');
    const state = getState();
    return this._mainService
      .getEntities()
      .pipe(tap((data) => patchState({ Entites: data })));
  }

  @Action(CLIENTS_ACTIONS.changeTableMode)
  public changeTableMode(
    { dispatch, patchState, getState }: StateContext<OrganizationStateModel>,
    { tableMode }: CLIENTS_ACTIONS.changeTableMode
  ) {
    const state = getState();
    patchState({ TableMode: tableMode });
  }

  @Action(CLIENTS_ACTIONS.setClientSelected)
  public setClientSelected(
    { getState, patchState }: StateContext<OrganizationStateModel>,
    { Client }: CLIENTS_ACTIONS.setClientSelected
  ) {
    patchState({ SelectedClient: Client });
  }

  @Action(CLIENTS_ACTIONS.setPortfolioSelected)
  public setPortfolioSelected(
    { getState, patchState }: StateContext<OrganizationStateModel>,
    { Portfolio }: CLIENTS_ACTIONS.setPortfolioSelected
  ) {
    patchState({ SelectedPortfolio: Portfolio });
  }

  @Action(CLIENTS_ACTIONS.setTeamSelected)
  public setTeamSelected(
    { getState, patchState }: StateContext<OrganizationStateModel>,
    { Team }: CLIENTS_ACTIONS.setTeamSelected
  ) {
    patchState({ SelectedTeam: Team });
  }

  @Action(CLIENTS_ACTIONS.setDepartmentSelected)
  public setDepartmentSelected(
    { getState, patchState }: StateContext<OrganizationStateModel>,
    { Department }: CLIENTS_ACTIONS.setDepartmentSelected
  ) {
    patchState({ SelectedDepartment: Department });
  }

  @Action(CLIENTS_ACTIONS.getAndSetClientById)
  public getPortfolioByIdAndSetClient(
    { getState, patchState }: StateContext<OrganizationStateModel>,
    { id }: CLIENTS_ACTIONS.getAndSetClientById
  ) {
    return this._mainService.getClientById(id).pipe(
      tap((client) => {
        patchState({
          SelectedClient: client,
        });
      })
    );
  }

  @Action(CLIENTS_ACTIONS.getAndSetPortfolioById)
  public getAndSetPortfolioById(
    { getState, patchState }: StateContext<OrganizationStateModel>,
    { id }: CLIENTS_ACTIONS.getAndSetPortfolioById
  ) {
    return this._mainService.getPortfolioById(id).pipe(
      tap((portfolio) => {
        patchState({
          SelectedClient: portfolio.account,
          SelectedPortfolio: portfolio,
        });
      })
    );
  }


  @Action(CLIENTS_ACTIONS.getAndSetDepartmentById)
  public getAndSetDepartmentById(
    { patchState }: StateContext<OrganizationStateModel>,
    { id }: CLIENTS_ACTIONS.getAndSetDepartmentById
  ) {
    return this._mainService.getDepartmentByPlatformId(id).pipe(
      tap((data) => {
        patchState({
          SelectedClient: data[0].platform.portfolio.account,
          SelectedPortfolio:  data[0].platform.portfolio,
          SelectedTeam:  data[0].platform,
          Departments: data
        });
      })
    );
  }

  @Action(CLIENTS_ACTIONS.resetPortfolioSelected)
  public resetPortfolioSelected({
    getState,
    patchState,
  }: StateContext<OrganizationStateModel>) {
    patchState({ SelectedPortfolio: null });
  }

  @Action(CLIENTS_ACTIONS.resetClientSelected)
  public resetClientSelected({
    getState,
    patchState,
  }: StateContext<OrganizationStateModel>) {
    patchState({ SelectedClient: null });
  }

  @Action(CLIENTS_ACTIONS.resetTeamSelected)
  public resetTeamSelected({
    getState,
    patchState,
  }: StateContext<OrganizationStateModel>) {
    patchState({ SelectedTeam: null });
  }

  @Action(CLIENTS_ACTIONS.resetDepartmentSelected)
  public resetDepartmentSelected({
    getState,
    patchState,
  }: StateContext<OrganizationStateModel>) {
    patchState({ SelectedDepartment: null });
  }

  @Action(CLIENTS_ACTIONS.searchClient)
  public searchClient({
    getState,
    patchState,
    dispatch,
  }: StateContext<OrganizationStateModel>) {
    const state = getState();
    patchState({
      pagination: { ...getState().pagination, pageIndex: 0 }, // Don't ever forget to reset the page number to zero when you filter or search
    });
    dispatch(new CLIENTS_ACTIONS.getClients(state.filtration));
  }

  @Action(CLIENTS_ACTIONS.searchPortfolios)
  public searchPortfolios({
    getState,
    patchState,
    dispatch,
  }: StateContext<OrganizationStateModel>) {
    const state = getState();
    patchState({
      portfolioPagination: { ...getState().pagination, pageIndex: 0 }, // Don't ever forget to reset the page number to zero when you filter or search
    });
    dispatch(new CLIENTS_ACTIONS.getPortfolios(state.filtration));
  }

  @Action(CLIENTS_ACTIONS.searchTeams)
  public searchTeams({
    getState,
    patchState,
    dispatch,
  }: StateContext<OrganizationStateModel>) {
    const state = getState();
    patchState({
      teamPagination: { ...getState().pagination, pageIndex: 0 }, // Don't ever forget to reset the page number to zero when you filter or search
    });
    dispatch(new CLIENTS_ACTIONS.getTeams(state.filtration));
  }

  @Action(CLIENTS_ACTIONS.resetSearchQuery)
  public resetSearchQuery({
    getState,
    patchState,
  }: StateContext<OrganizationStateModel>) {
    const filtration = getState().filtration;
    patchState({ filtration: { ...filtration, searchQuery: '' } });
  }

  //   @Action(MY_TASKS_ACTIONS.GetAssignedPortfolios)
  //   public getMyAssignedPortfolios(
  //     { getState, patchState }: StateContext<MyTeamsStateModel>,
  //     { clienId }: GetAssignedPortfolios
  //   ) {
  //     // const { portfolios } = getState();
  //     return this._mainService.getMyAllowedPortfolios(clienId).pipe(
  //       tap((result: MY_TASKS_MODELS.AssignedPortfolios | any) => {
  //         const filterSchema: MY_TASKS_MODELS.AssignedPortfolios =
  //           MY_TASKS_CONFIG.filterSchema;
  //         patchState({ portfolios: [filterSchema, ...result] });
  //       })
  //     );
  //   }

  //   @Action(MY_TASKS_ACTIONS.GetAssignedTeams)
  //   public getMyAssignedTeams(
  //     { getState, patchState }: StateContext<MyTeamsStateModel>,
  //     { clientId, portfolioId }: GetAssignedTeams
  //   ) {
  //     // const { portfolios } = getState();
  //     return this._mainService.getMyAllowedTeams(clientId, portfolioId).pipe(
  //       tap((result: MY_TASKS_MODELS.AssignedPortfolios | any) => {
  //         const filterSchema: MY_TASKS_MODELS.AssignedPortfolios =
  //           MY_TASKS_CONFIG.filterSchema;
  //         patchState({ teams: [filterSchema, ...result] });
  //       })
  //     );
  //   }

  //   /*__________________Pagination______________________*/

  //   @Action(MY_TASKS_ACTIONS.setClientId)
  //   public SetClientId(
  //     { dispatch, patchState, getState }: StateContext<MyTeamsStateModel>,
  //     { clientID }: MY_TASKS_ACTIONS.setClientId
  //   ) {
  //     const state = getState();
  //     patchState({ filtration: { clientId: clientID } });
  //   }

  //   @Action(MY_TASKS_ACTIONS.setFilters)
  //   public SetFilters(
  //     { dispatch, patchState, getState }: StateContext<MyTeamsStateModel>,
  //     { payload }: MY_TASKS_ACTIONS.setFilters
  //   ) {
  //     const state = getState();
  //     patchState({ filtration: { ...state.filtration, ...payload } });
  //   }
  //   /*_____________________________Filtration_______________________*/

  //   /*______________________Search my tasks___________________*/

  //   @Action(MY_TASKS_ACTIONS.SearchMyTeams)
  //   public SearchMyTasks(
  //     { patchState, getState, dispatch }: StateContext<MyTeamsStateModel>,
  //     { searchQuery }: MY_TASKS_ACTIONS.SearchMyTeams
  //   ) {
  //     patchState({
  //       searchQuery,
  //       pagination: { ...getState().pagination, pageNumber: 0 },
  //     });
  //     // dispatch(new MY_TASKS_ACTIONS.GetMyTeams());
  //   }

  //   @Action(MY_TASKS_ACTIONS.SortMyTeams)
  //   public sortMyRequests(
  //     { patchState, dispatch }: StateContext<MyTeamsStateModel>,
  //     { sort }: MY_TASKS_ACTIONS.SortMyTeams
  //   ) {
  //     patchState({
  //       sort,
  //     });
  //     // dispatch(new MY_TASKS_ACTIONS.GetMyTeams());
  //   }

  //   /*_________________take an action______________________*/

  //   @Action(MY_TASKS_ACTIONS.TakeActionOnTeam)
  //   public takeActionOnTask(
  //     { dispatch }: StateContext<MyTeamsStateModel>,
  //     { takeActionsParams }: MY_TASKS_ACTIONS.TakeActionOnTeam
  //   ) {
  //     return this._mainService.takeAction(takeActionsParams).pipe(
  //       tap((res) => {
  //         // dispatch(new MY_TASKS_ACTIONS.GetMyTeams());
  //       })
  //     );
  //   }
}
