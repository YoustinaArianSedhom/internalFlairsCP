import { Injectable } from '@angular/core';
import { PaginationModel } from '@core/http/apis.model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { TableColumnSortModel } from '@shared/modules/tables/model/tables.model';
import { tap } from 'rxjs/operators';
import { SSAConfigInst } from 'src/app/config/app.config';
import * as CLIENTS_MANAGEMENT_MODELS from '../models/clients-management.models';
import * as CLIENTS_MANAGEMENT_CONFIG from '../models/clients-management.config';
import * as CLIENTS_MANAGEMENT_ACTIONS from '../state/clients-managements.actions';
import { GetMyOrganization } from '@core/modules/organization/state/organization.actions';
import { ClientsManagementService } from '../models/clients-management.service';

export class ClientStateModel {
  public Admins: CLIENTS_MANAGEMENT_MODELS.Admin[];
  public InternalAdmins: CLIENTS_MANAGEMENT_MODELS.InternalAdmin[];
  public Clients: CLIENTS_MANAGEMENT_MODELS.Client[];
  public Portfolios: CLIENTS_MANAGEMENT_MODELS.Portfolios[];
  public Teams: CLIENTS_MANAGEMENT_MODELS.Teams[];
  public pagination: PaginationConfigModel;
  public Adminspagination: PaginationConfigModel;
  public InternalAdminsPagination: PaginationConfigModel;
  public filtration: CLIENTS_MANAGEMENT_MODELS.Filtration;
  public InternalAdminFiltration: CLIENTS_MANAGEMENT_MODELS.InternalAdminsFiltration;

  public ClientIDS: CLIENTS_MANAGEMENT_MODELS.Client[];

  public Mode: string;

  constructor() {
    this.Admins = null;
    this.InternalAdmins = null;
    this.Clients = null;

    this.ClientIDS = null;

    this.Portfolios = null;
    this.Teams = null;

    this.Mode = null;

    this.pagination = {
      pageSize: 10,
    };

    this.Adminspagination = {
      pageSize: 10,
    };

    this.InternalAdminsPagination = {
      pageSize: 10,
    };

    this.filtration = {};
  }
}
/*_______________________________DEFINING STATE__________________________________*/
@Injectable()
@State<ClientStateModel>({
  name: 'ClientsManagement',
  defaults: new ClientStateModel(),
})
export class ClientsManagementState {
  constructor(private _mainService: ClientsManagementService) {}

  /*__________________________________________SELECTORS___________________________________*/

  @Selector() static Admins(
    state: ClientStateModel
  ): CLIENTS_MANAGEMENT_MODELS.Admin[] {
    return state.Admins;
  }

  @Selector() static InternalAdmins(
    state: ClientStateModel
  ): CLIENTS_MANAGEMENT_MODELS.InternalAdmin[] {
    return state.InternalAdmins;
  }

  @Selector() static ClientIDS(
    state: ClientStateModel
  ): CLIENTS_MANAGEMENT_MODELS.Client[] {
    return state.ClientIDS;
  }

  @Selector() static Clients(
    state: ClientStateModel
  ): CLIENTS_MANAGEMENT_MODELS.Client[] {
    return state.Clients;
  }

  @Selector() static Portfolios(
    state: ClientStateModel
  ): CLIENTS_MANAGEMENT_MODELS.Portfolios[] {
    return state.Portfolios;
  }

  @Selector() static Teams(
    state: ClientStateModel
  ): CLIENTS_MANAGEMENT_MODELS.Teams[] {
    return state.Teams;
  }

  @Selector() static Mode(state: ClientStateModel): string {
    return state.Mode;
  }

  @Selector() static AdminsPaginationConfig(
    state: ClientStateModel
  ): PaginationConfigModel {
    return { ...state.Adminspagination };
  }

  @Selector() static InternalAdminsPaginationConfig(
    state: ClientStateModel
  ): PaginationConfigModel {
    return { ...state.InternalAdminsPagination };
  }

  @Selector() static paginationConfig(
    state: ClientStateModel
  ): PaginationConfigModel {
    return { ...state.pagination };
  }

  @Selector() static filtration(
    state: ClientStateModel
  ): CLIENTS_MANAGEMENT_MODELS.Filtration {
    return { ...state.filtration };
  }

  /*_______________________________________REDUCERS____________________________________*/

  /*_____________Retrieve my tasks table data _____________*/

  @Action(CLIENTS_MANAGEMENT_ACTIONS.GetAdmins)
  public getAdmins(
    { getState, patchState }: StateContext<ClientStateModel>,
    { payload }: CLIENTS_MANAGEMENT_ACTIONS.GetAdmins
  ) {
    const {
      Adminspagination: { pageIndex, pageSize },
    } = getState();
    return this._mainService.getAdmins({ pageIndex, pageSize }, payload).pipe(
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

  @Action(CLIENTS_MANAGEMENT_ACTIONS.getInternalAdmins)
  public getInternalAdmins(
    { getState, patchState }: StateContext<ClientStateModel>,
    { payload }: CLIENTS_MANAGEMENT_ACTIONS.getInternalAdmins
  ) {
    const {
      InternalAdminsPagination: { pageIndex, pageSize },
    } = getState();
    return this._mainService
      .getInternalAdmins({ pageIndex, pageSize }, payload)
      .pipe(
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
              InternalAdmins: [...records],
              InternalAdminsPagination: {
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

  @Action(CLIENTS_MANAGEMENT_ACTIONS.getClients)
  public GetClients(
    { getState, patchState }: StateContext<ClientStateModel>,
    { payload }: CLIENTS_MANAGEMENT_ACTIONS.getClients
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
          }: PaginationModel<CLIENTS_MANAGEMENT_MODELS.Client>) => {
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

  @Action(CLIENTS_MANAGEMENT_ACTIONS.getClientsIDS)
  public getClientsIDS({
    getState,
    patchState,
  }: StateContext<ClientStateModel>) {
    const { filtration } = getState();
    return this._mainService.getClientsIDS().pipe(
      tap((data: any) =>
        patchState({
          ClientIDS: [CLIENTS_MANAGEMENT_CONFIG.filterSchema, ...data],
        })
      )
    );
  }

  @Action(CLIENTS_MANAGEMENT_ACTIONS.getAllowedPortfolios)
  public GetAssignedPortfolios(
    { patchState, dispatch, getState }: StateContext<ClientStateModel>,
    { clientId }: CLIENTS_MANAGEMENT_ACTIONS.getAllowedPortfolios
  ) {
    const state = getState();
    return this._mainService.getAllowedPortfolios(clientId).pipe(
      tap((result: any) => {
        patchState({
          Portfolios: [CLIENTS_MANAGEMENT_CONFIG.filterSchema, ...result],
        });
      })
    );
  }

  @Action(CLIENTS_MANAGEMENT_ACTIONS.getAllowedTeams)
  public getAllowedTeams(
    { patchState, dispatch, getState }: StateContext<ClientStateModel>,
    { filteration }: CLIENTS_MANAGEMENT_ACTIONS.getAllowedTeams
  ) {
    const state = getState();
    return this._mainService.getAllowedTeams(filteration).pipe(
      tap((result: any) => {
        patchState({
          Teams: [CLIENTS_MANAGEMENT_CONFIG.filterSchema, ...result],
        });
        let teamdIDS: any = result;
        teamdIDS = teamdIDS.map((team) => team.id);
        if (state.Mode === 'External') {
          dispatch(
            new CLIENTS_MANAGEMENT_ACTIONS.setFilters({ teamsIds: teamdIDS })
          );
          dispatch(new CLIENTS_MANAGEMENT_ACTIONS.FilterAdmins());
        }
        if (state.Mode === 'Internal') {
          dispatch(
            new CLIENTS_MANAGEMENT_ACTIONS.setInternalAdminFilters({
              teamsIds: teamdIDS,
            })
          );
          dispatch(new CLIENTS_MANAGEMENT_ACTIONS.FilterInternalAdmins());
        }
      })
    );
  }

  @Action(CLIENTS_MANAGEMENT_ACTIONS.changeMode)
  public changeMode(
    { dispatch, patchState, getState }: StateContext<ClientStateModel>,
    { Mode }: CLIENTS_MANAGEMENT_ACTIONS.changeMode
  ) {
    const state = getState();
    patchState({ Mode });
  }

  @Action(CLIENTS_MANAGEMENT_ACTIONS.setFilters)
  public SetFilters(
    { dispatch, patchState, getState }: StateContext<ClientStateModel>,
    { payload }: CLIENTS_MANAGEMENT_ACTIONS.setFilters
  ) {
    const state = getState();
    patchState({ filtration: { ...state.filtration, ...payload } });
  }

  @Action(CLIENTS_MANAGEMENT_ACTIONS.setInternalAdminFilters)
  public setInternalAdminFilters(
    { dispatch, patchState, getState }: StateContext<ClientStateModel>,
    { payload }: CLIENTS_MANAGEMENT_ACTIONS.setInternalAdminFilters
  ) {
    const state = getState();
    patchState({
      InternalAdminFiltration: {
        ...state.InternalAdminFiltration,
        ...payload,
      },
    });
  }

  @Action(CLIENTS_MANAGEMENT_ACTIONS.resetFilters)
  public resetFilters({
    dispatch,
    patchState,
    getState,
  }: StateContext<ClientStateModel>) {
    const state = getState();
    patchState({ filtration: {} });
  }

  @Action(CLIENTS_MANAGEMENT_ACTIONS.resetInternalAdminFilters)
  public resetInternalAdminFilters({
    dispatch,
    patchState,
    getState,
  }: StateContext<ClientStateModel>) {
    const state = getState();
    patchState({
      InternalAdminFiltration: {},
      InternalAdminsPagination: { pageSize: 10 },
    });
  }

  @Action(CLIENTS_MANAGEMENT_ACTIONS.PaginateAdmins)
  public PaginateAdmins(
    { dispatch, patchState, getState }: StateContext<ClientStateModel>,
    { pagination }: CLIENTS_MANAGEMENT_ACTIONS.PaginateAdmins
  ) {
    const state = getState();
    if (pagination.pageSize !== state.Adminspagination.pageSize) {
      pagination.pageIndex = 0;
    }
    patchState({
      Adminspagination: { ...state.Adminspagination, ...pagination },
    });
    dispatch(new CLIENTS_MANAGEMENT_ACTIONS.GetAdmins(state.filtration));
  }

  @Action(CLIENTS_MANAGEMENT_ACTIONS.PaginateInternalAdmins)
  public PaginateInternalAdmins(
    { dispatch, patchState, getState }: StateContext<ClientStateModel>,
    { pagination }: CLIENTS_MANAGEMENT_ACTIONS.PaginateAdmins
  ) {
    const state = getState();
    if (pagination.pageSize !== state.InternalAdminsPagination.pageSize) {
      pagination.pageIndex = 0;
    }
    patchState({
      InternalAdminsPagination: {
        ...state.InternalAdminsPagination,
        ...pagination,
      },
    });
    dispatch(
      new CLIENTS_MANAGEMENT_ACTIONS.getInternalAdmins(
        state.InternalAdminFiltration
      )
    );
  }

  @Action(CLIENTS_MANAGEMENT_ACTIONS.FilterAdmins)
  public FilterAdmins({
    getState,
    patchState,
    dispatch,
  }: StateContext<ClientStateModel>) {
    const state = getState();
    patchState({
      Adminspagination: { ...getState().Adminspagination, pageIndex: 0 }, // Don't ever forget to reset the page number to zero when you filter or search
    });
    dispatch(new CLIENTS_MANAGEMENT_ACTIONS.GetAdmins(state.filtration));
  }

  @Action(CLIENTS_MANAGEMENT_ACTIONS.FilterInternalAdmins)
  public FilterInternalAdmins({
    getState,
    patchState,
    dispatch,
  }: StateContext<ClientStateModel>) {
    const state = getState();
    patchState({
      InternalAdminsPagination: {
        ...getState().InternalAdminsPagination,
        pageIndex: 0,
      },
    });
    dispatch(
      new CLIENTS_MANAGEMENT_ACTIONS.getInternalAdmins(
        state.InternalAdminFiltration
      )
    );
  }
}
