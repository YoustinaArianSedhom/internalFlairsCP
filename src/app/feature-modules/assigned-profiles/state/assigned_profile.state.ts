import { Injectable } from '@angular/core';
import { PaginationModel } from '@core/http/apis.model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { TableColumnSortModel } from '@shared/modules/tables/model/tables.model';
import { tap } from 'rxjs/operators';
import { SSAConfigInst } from 'src/app/config/app.config';
import * as Profile_MODELS from '../models/assigned-profile.model';
import * as Profile_CONFIG from '../models/assigned-profile.config';
import { AssignedProfilesService } from '../models/assigned-profiles.service';
import {
  deleteAssignedProfiles,
  paginateMyTeams,
  getAssignedProfiles,
  setSpecificProfileDetails,
  getAssignedProfileById,
  getAllClients,
  getAllowedPortfolios,
  getAllowedTeams,
  filterAssignedProfiles,
  setFilters,
  resetFilters,
  EndAssociation,
  EditEndAssociation,
  getDepartments,
  GetDepartmentByPlatform,
  importExcel,
  exportExcel,
  exportTemplateExcel,
  ChangeContractType
} from './assigned_profile.actions';
import { downloadFile } from '@shared/helpers/download-file.helper';

export class AssignedProfileModel {
  public Profiles: Profile_MODELS.ProfilesModel[];
  public Clients: Profile_MODELS.Client[];
  public Portfolios: Profile_MODELS.Portfolio[];
  public Teams: Profile_MODELS.Team[];
  public SpecificProfileDetails: Profile_MODELS.ProfilesModel;
  public pagination: PaginationConfigModel;
  public filtration: Profile_MODELS.AssignedProfileFiltrationModel;
  public searchQuery: string;
  public departments: Profile_MODELS.Departments[];
  public excelErrors: Profile_MODELS.ExcelErrors[];
  public excelUploadSucess: boolean;

  constructor() {
    this.Profiles = null;
    this.Clients = null;
    this.Portfolios = null;
    this.Teams = null;
    this.SpecificProfileDetails = null;

    this.pagination = {
      pageSize: 10,
    };
    this.filtration = {};
    this.searchQuery = '';
    this.departments= []
    this.excelErrors = null
    this.excelUploadSucess = null;
  }
}
/*_______________________________DEFINING STATE__________________________________*/
@Injectable()
@State<AssignedProfileModel>({
  name: 'AssignedProfiles',
  defaults: new AssignedProfileModel(),
})
export class AssignedProfileState {
  constructor(private _mainService: AssignedProfilesService) {}

  /*__________________________________________SELECTORS___________________________________*/

  @Selector() static profiles(
    state: AssignedProfileModel
  ): Profile_MODELS.ProfilesModel[] {
    return state.Profiles;
  }

  @Selector() static Clients(
    state: AssignedProfileModel
  ): Profile_MODELS.Client[] {
    return state.Clients;
  }

  @Selector() static Portfolios(
    state: AssignedProfileModel
  ): Profile_MODELS.Portfolio[] {
    return state.Portfolios;
  }

  @Selector() static Teams(state: AssignedProfileModel): Profile_MODELS.Team[] {
    return state.Teams;
  }

  @Selector() static specificProfile(
    state: AssignedProfileModel
  ): Profile_MODELS.ProfilesModel {
    return state.SpecificProfileDetails;
  }

  @Selector() static paginationConfig(
    state: AssignedProfileModel
  ): PaginationConfigModel {
    return { ...state.pagination };
  }

  @Selector() static filtration(
    state: AssignedProfileModel
  ): Profile_MODELS.MyTeamsFiltrationModel {
    return { ...state.filtration };
  }

  @Selector() static filtrationSkills(state: AssignedProfileModel): number {
    return state.filtration.skillsIds?.length;
  }

  @Selector() static departments(
    state: AssignedProfileModel
  ): Profile_MODELS.Departments[] {
    return state.departments;
  }

  @Selector() static departmentNames(
    state: AssignedProfileModel
  ): Profile_MODELS.Departments[] {
    const result = [];
    state.departments.map((item) => {
      result[item.id] = item.name;
    });

    return result;
  }

  @Selector() static excelErrors(state: AssignedProfileModel): Profile_MODELS.ExcelErrors[] {
    return state.excelErrors;
  }

  @Selector() static excelUploadSucess(state: AssignedProfileModel): boolean {
    return state.excelUploadSucess;
  }

  /*_______________________________________REDUCERS____________________________________*/

  /*_____________Retrieve my tasks table data _____________*/

  @Action(getAssignedProfiles)
  public GetProfiles(
    { getState, patchState }: StateContext<AssignedProfileModel>,
    { payload }: getAssignedProfiles
  ) {
    const {
      pagination: { pageIndex, pageSize },
    } = getState();
    return this._mainService
      .getAllAssignedProfiles({ pageIndex, pageSize }, { ...payload })
      .pipe(
        tap(
          ({
            records,
            recordsTotalCount,
            totalPages,
            pageIndex,
            pageSize,
            previousPage,
          }: PaginationModel<Profile_MODELS.ProfilesModel>) => {
            patchState({
              Profiles: records,
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

  // /*__________________Pagination______________________*/

  @Action(paginateMyTeams)
  public paginateMyTasks(
    { dispatch, patchState, getState }: StateContext<AssignedProfileModel>,
    { pagination }: paginateMyTeams
  ) {
    const state = getState();
    if (pagination.pageSize !== state.pagination.pageSize) {
      pagination.pageIndex = 0;
    }
    patchState({ pagination: { ...state.pagination, ...pagination } });
    dispatch(new getAssignedProfiles(state.filtration));
  }

  @Action(setFilters)
  public setFilters(
    { dispatch, patchState, getState }: StateContext<AssignedProfileModel>,
    { payload }: setFilters
  ) {
    // console.log('set', payload);
    const state = getState();
    patchState({ filtration: { ...state.filtration, ...payload } });
  }
  /*_____________________________Filtration_______________________*/

  @Action(filterAssignedProfiles)
  public filterAssignedProfiles({
    patchState,
    dispatch,
    getState,
  }: StateContext<AssignedProfileModel>,
  { withPagination }: filterAssignedProfiles) {
    const state = getState();
    if(!withPagination){
      patchState({
        pagination: { ...getState().pagination, pageIndex: 0 },
      });
    }
    dispatch(new getAssignedProfiles(state.filtration));
  }

  @Action(deleteAssignedProfiles)
  public deleteAssignedProfileRequest(
    ctx: StateContext<AssignedProfileModel>,
    { profileId }: deleteAssignedProfiles
  ) {
    // console.log('profileId', profileId);
    return this._mainService.deleteAssignedProfileRequest(profileId);
  }

  @Action(resetFilters)
  public resetFilters({
    patchState,
    dispatch,
    getState,
  }: StateContext<AssignedProfileModel>) {
    // console.log('profileId', profileId);
    patchState({ filtration: {} });
  }

  @Action(setSpecificProfileDetails)
  public SetSpecificProfileDetails(
    { patchState, dispatch, getState }: StateContext<AssignedProfileModel> // { filtration }: MY_TASKS_ACTIONS.FilterMyTeams
  ) {
    const state = getState();
    patchState({
      SpecificProfileDetails: null,
    });
  }

  @Action(getAssignedProfileById)
  public GetProfileById(
    { patchState, dispatch, getState }: StateContext<AssignedProfileModel>,
    { id }: getAssignedProfileById
  ) {
    const state = getState();
    return this._mainService.getAssignedProfileById(id).pipe(
      tap((client: Profile_MODELS.ProfilesModel) => {
        patchState({ SpecificProfileDetails: client });
      })
    );
  }

  @Action(getAllClients)
  public getAllClients({
    patchState,
    dispatch,
    getState,
  }: StateContext<AssignedProfileModel>) {
    const state = getState();
    return this._mainService.getClients().pipe(
      tap((result: any) => {
        patchState({
          Clients: [Profile_CONFIG.filterSchema, ...result],
        });
      })
    );
  }

  @Action(getAllowedPortfolios)
  public GetAssignedPortfolios(
    { patchState, dispatch, getState }: StateContext<AssignedProfileModel>,
    { clientId }: getAllowedPortfolios
  ) {
    const state = getState();
    return this._mainService.getAllowedPortfolios(clientId).pipe(
      tap((result: any) => {
        patchState({
          Portfolios: [Profile_CONFIG.filterSchema, ...result],
          filtration:{...getState().filtration,clientId}
        });
      })
    );
  }

  @Action(getAllowedTeams)
  public getAllowedTeams(
    { patchState, dispatch, getState }: StateContext<AssignedProfileModel>,
    { filteration, withPagination }: getAllowedTeams
  ) {
    const state = getState();
    return this._mainService.getAllowedTeams(filteration).pipe(
      tap((result: any) => {
        patchState({
          Teams: [Profile_CONFIG.filterSchema, ...result],
        });
        let teamdIDS: any = result;
        teamdIDS = teamdIDS.map((team) => team.id);
        dispatch(
          new setFilters({ PlatformsIds: filteration.teamId ? [filteration.teamId] : teamdIDS, 
            status: filteration.status||filteration.status===0 ? filteration.status : undefined,
            contractType: filteration.contractType||filteration.contractType===0 ? filteration.contractType : undefined, portfolioId : filteration.PortfolioId, teamId : filteration.teamId, clientId : filteration.accountId })
        );
        console.log('in here', withPagination)
          dispatch(new filterAssignedProfiles(withPagination));
        
      })
    );
  }

  @Action(EndAssociation)
  public endAssociation(
    ctx: StateContext<AssignedProfileModel>,
    { payload }: EndAssociation
  ) {
    return this._mainService.endAssociation(payload);
  }
  @Action(EditEndAssociation)
  public editEndAssociation(
    ctx: StateContext<AssignedProfileModel>,
    { payload }: EditEndAssociation
  ) {
    return this._mainService.editEndAssociation(payload);
  }
  @Action(getDepartments)
  public getDepartments({
    patchState,
    dispatch,
    getState,
  }: StateContext<AssignedProfileModel>) {
    const state = getState();
    return this._mainService.getDepartments().pipe(
      tap((result: any) => {
        patchState({
          departments: result,
        });
      })
    );
  }

  @Action(GetDepartmentByPlatform)
  public GetDepartmentByPlatform({
    patchState,
    dispatch,
    getState,
  }: StateContext<AssignedProfileModel> , {platformId}: GetDepartmentByPlatform){
    const state = getState();
    return this._mainService.getDepartmentsByPlatformId(platformId).pipe(
      tap((result: any) => {
        patchState({
          departments: result,
        });
      })
    );
  }

  @Action(importExcel)
  public importExcel({
    patchState,
    getState,
  }: StateContext<AssignedProfileModel> , {file}: importExcel){
    const state = getState();
    return this._mainService.importExcel(file).pipe(
      tap((result: Profile_MODELS.ExcelErrors[]) => {
        if(result && result.length > 0){
        patchState({
          excelErrors: result,
          excelUploadSucess: false
        });
      }else{
        patchState({
          excelErrors: null,
          excelUploadSucess: true
        });
      }
      })
    );
  }

  @Action(exportExcel)
  public exportExcel({
    getState,
  }: StateContext<AssignedProfileModel>){
    const state = getState();
    return this._mainService.exportExcel(state.filtration).pipe(
      tap((result) => {
        downloadFile(result.body, 'Assigned Profiles', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      })
    );
  }

  @Action(exportTemplateExcel)
  public exportTemplateExcel({
    getState,
  }: StateContext<AssignedProfileModel>){
    const state = getState();
    return this._mainService.exportTemplateExcel().pipe(
      tap((result) => {
        downloadFile(result.body, 'Assigned Profiles Import Template', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      })
    );
  }

  @Action(ChangeContractType)
  public ChangeContractType({dispatch}: StateContext<AssignedProfileModel>, { body }: ChangeContractType){
    return this._mainService.changeContractType(body).pipe(
      tap((result)=> result)
    )
  }
}
