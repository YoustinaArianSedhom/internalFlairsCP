import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { tap } from 'rxjs/operators';
import * as PO_MODELS from '../models/po.models';
import { PoService } from '../models/po.service';
import * as PO_Action from '../state/po.actions';
import { PaginationModel } from '@core/http/apis.model';

export class POStateModel {

  public Profiles: PO_MODELS.POModel[];
  public poPagination: PaginationConfigModel;
  public pagination: PaginationConfigModel;
  public filtration: PO_MODELS.POFiltrationModel;
  public searchQuery: string;
  public departments: PO_MODELS.Departments[];
  public Clients: PO_MODELS.Client[];
  public portfolios: PO_MODELS.Portfolio[];
  public teams: PO_MODELS.Team[];
  public externalAdmins: PO_MODELS.ExternalAdminModel[];
  public managers: PO_MODELS.InternalAdminModel[];
  public pOList: PO_MODELS.POList[];
  public body: PO_MODELS.FliterManger;
  public modelPO: PO_MODELS.PoModelRecord;
  public currency: PO_MODELS.Currency[];
  public assignedProfileRoles: PO_MODELS.AssignedProfileRolesModel[];
  public locations: PO_MODELS.LocationsModel[];
  public errorMessages: string[];
  public showTotalAmount: boolean

  constructor() {
    this.modelPO = null;
    this.Profiles = null;
    this.pOList = null;
    this.externalAdmins = null;
    this.departments = null;
    this.managers = null;
    this.Profiles = null;
    this.pagination = {
      pageIndex: 0,
      pageSize: 10
    }

    this.filtration = {};
    this.searchQuery = '';
    this.currency = null;
    this.assignedProfileRoles = null;
    this.locations = null;
    this.errorMessages = null;
    this.showTotalAmount = null;
  }
}
/*_______________________________DEFINING STATE__________________________________*/
@Injectable()
@State<POStateModel>({
  name: 'POStateModel',
  defaults: new POStateModel(),
})
export class POState {
  constructor(private _mainService: PoService) { }

  /*__________________________________________SELECTORS___________________________________*/

  @Selector() static searchQuery(state: POStateModel): string { return state.searchQuery }


  @Selector() static pocreate(
    state: POStateModel
  ): PO_MODELS.POModel[] {
    return state.Profiles;
  }
  @Selector() static paginationConfig(
    state: POStateModel
  ): PaginationConfigModel {
    return { ...state.pagination };
  }

  @Selector() static departments(
    state: POStateModel
  ): PO_MODELS.Departments[] {
    return state.departments;
  }

  @Selector() static Clients(
    state: POStateModel
  ): PO_MODELS.Client[] {
    return state.Clients;
  }
  @Selector() static portfolios(
    state: POStateModel
  ): PO_MODELS.Portfolio[] {
    return state.portfolios;
  }

  @Selector() static managers(
    state: POStateModel
  ): PO_MODELS.InternalAdminModel[] {
    return state.managers;
  }

  @Selector() static externalAdmins(state: POStateModel): PO_MODELS.ExternalAdminModel[] { return state.externalAdmins }
  @Selector() static teams(state: POStateModel): PO_MODELS.Team[] {
    return state.teams;
  }

  @Selector() static pOList(state: POStateModel): PO_MODELS.POList[] { return state.pOList }
  @Selector() static pOListPagination(state: POStateModel): PaginationConfigModel { return { ...state.pagination } }
  @Selector() static modelPO(
    state: POStateModel
  ): PO_MODELS.PoModelRecord {
    return state.modelPO;
  }

  @Selector() static currency(
    state: POStateModel
  ): PO_MODELS.Currency[] {
    return state.currency;
  }

  @Selector() static assignedProfileRoles(state: POStateModel): PO_MODELS.AssignedProfileRolesModel[] { return state.assignedProfileRoles }
  @Selector() static locations(state: POStateModel): PO_MODELS.LocationsModel[] { return state.locations }
  @Selector() static errorMessages(state: POStateModel): string[] { return state.errorMessages }
  @Selector() static showTotalAmount(state: POStateModel): boolean { return state.showTotalAmount }

  @Action(PO_Action.POAdd)
  public AddPO({ }: StateContext<POStateModel>, { formData }: PO_Action.POAdd) {
    return this._mainService.AddPO(formData).pipe(
      tap((res: boolean) => res)
    )
  }

  @Action(PO_Action.POUpdate)
  public POUpdate({ }: StateContext<POStateModel>, { formData }: PO_Action.POUpdate) {
    return this._mainService.UpdatedPO(formData).pipe(
      tap((res: boolean) => res)
    )
  }
  @Action(PO_Action.GetAllTeams)
  public GetAllTeams({ patchState }: StateContext<POStateModel>, { model }: PO_Action.GetAllTeams) {
    return this._mainService.getAllTeams(model).pipe(
      tap((teams: PO_MODELS.Team[]) => patchState({ teams }))
    )
  }

  @Action(PO_Action.GetAllClients)
  public getAllClients({ patchState, }: StateContext<POStateModel>, { value }: PO_Action.GetAllClients) {
    return this._mainService.getClients(value).pipe(
      tap((Clients: PO_MODELS.Client[]) => patchState({ Clients }))
    );
  }
  @Action(PO_Action.GetAllPortfolios)
  public getAllPortfolios({ patchState, }: StateContext<POStateModel>, { value }: PO_Action.GetAllPortfolios) {
    return this._mainService.getAllPortfolios(value).pipe(
      tap((result: PO_MODELS.Portfolio[]) => {
        patchState({
          portfolios: [...result],
        });
      })
    );
  }
  @Action(PO_Action.GetAllPortfoliosByKey)
  public getAllPortfoliosByKey({ patchState, }: StateContext<POStateModel>, { value, search }: PO_Action.GetAllPortfoliosByKey) {
    return this._mainService.searchAllPortfolios(value, search).pipe(
      tap((result: PO_MODELS.Portfolio[]) => {
        patchState({
          portfolios: [...result],
        });
      })
    );
  }

  @Action(PO_Action.GetAllInternalManagers)
  public getAllInternalManagers({ patchState, }: StateContext<POStateModel>, { search, body }: PO_Action.GetAllInternalManagers) {
    return this._mainService.getAllInternalManagers(search, body).pipe(
      tap((managers: PO_MODELS.InternalAdminModel[]) => patchState({ managers })))
  }

  @Action(PO_Action.GetAllExternalAdmins)
  public GetAllExternalAdmins({ patchState }: StateContext<POStateModel>, { search, body }: PO_Action.GetAllExternalAdmins) {
    return this._mainService.getExternalManager(search, body).pipe(
      tap((externalAdmins: PO_MODELS.ExternalAdminModel[]) => patchState({ externalAdmins }))
    )
  }

  @Action(PO_Action.SearchFilteredPage)
  public SearchFilteredPage({ dispatch, patchState, getState }: StateContext<POStateModel>, { searchQuery }: PO_Action.SearchFilteredPage) {
    patchState({
      searchQuery,
      poPagination: { ...getState().poPagination, pageIndex: 0 }
    });
    dispatch(new PO_Action.GetAllPO())
  }

  @Action(PO_Action.GetAllPO)
  public GetPOList({ getState, patchState }: StateContext<POStateModel>) {
    const { pagination: { pageIndex, pageSize }, searchQuery } = getState();
    return this._mainService.getPOList({ pageIndex, pageSize }, searchQuery).pipe(
      tap(
        ({ records: pOList, recordsTotalCount,
          totalPages,
          pageIndex,
          pageSize,
          previousPage }: PaginationModel<PO_MODELS.POList>) => {
          patchState({
            pOList,
            pagination: {
              recordsTotalCount,
              totalPages,
              pageIndex,
              pageSize,
              previousPageIndex: previousPage,
            }
          })

        }
      )
    )
  }

  @Action(PO_Action.PaginatePO)
  public PaginatePO({ patchState, getState, dispatch }: StateContext<POStateModel>, { pagination }: PO_Action.PaginatePO) {
    patchState({ pagination });
    dispatch(new PO_Action.GetAllPO())
  }

  @Action(PO_Action.GetDepartmentByPlatform)
  public GetDepartmentByPlatform({
    patchState,
    dispatch,
    getState,
  }: StateContext<POStateModel>, { platformId }: PO_Action.GetDepartmentByPlatform) {
    const state = getState();
    return this._mainService.getDepartmentsByPlatformId(platformId).pipe(
      tap((result: PO_MODELS.Departments[]) => {
        patchState({
          departments: [...result],
        });
      })
    );
  }



  @Action(PO_Action.GetPOById)
  public GetPOById({ getState, patchState }: StateContext<POStateModel>, { poId }: PO_Action.GetPOById) {
    const state = getState();
    return this._mainService.getPObyId(poId).pipe(
      tap(
        (modelPO: PO_MODELS.PoModelRecord) => patchState({ modelPO })
      ))
  }

  @Action(PO_Action.GetCurrencies)
  public GetCurrencies({ getState, patchState }: StateContext<POStateModel>, { query }: PO_Action.GetCurrencies) {
    const state = getState();
    return this._mainService.getCurrencies(query).pipe(
      tap(
        (currency: PO_MODELS.Currency[]) => patchState({ currency })
      ))
  }

  @Action(PO_Action.GetAssignedProfileRoles)
  public getAssignedProfileRoles({ patchState }: StateContext<POStateModel>) {
    return this._mainService.getAssignedProfileRoles().pipe(
      tap(
        (assignedProfileRoles: PO_MODELS.AssignedProfileRolesModel[]) => {
          patchState({ assignedProfileRoles })
        }
      )
    )
  }

  @Action(PO_Action.GetLocations)
  public getLocations({ patchState }: StateContext<POStateModel>) {
    return this._mainService.getLocations().pipe(
      tap(
        (locations: PO_MODELS.LocationsModel[]) => {
          patchState({ locations })
        }
      )
    )
  }

  @Action(PO_Action.DownloadNewAssociationTemplate)
  public downloadNewAssociationTemplate() {
    return this._mainService.downloadNewAssociationTemplate().pipe(
      tap((res) => {
        window.open(res, '_blank')
      })
    );
  }

  @Action(PO_Action.ImportNewAssociationFromExcel)
  public importNewAssociationFromExcel(ctx: StateContext<POStateModel>, { formData }: PO_Action.ImportNewAssociationFromExcel) {
    return this._mainService.importNewAssociationFromExcel(formData).pipe(
      tap((errorMessages) => {
        ctx.patchState({ errorMessages })
      })
    )
  }

  @Action(PO_Action.ToggleShowTotalAmount)
  public ToggleShowAmount({ patchState, getState}:StateContext<POStateModel>){
    patchState({showTotalAmount : !getState().showTotalAmount})
  }
}
