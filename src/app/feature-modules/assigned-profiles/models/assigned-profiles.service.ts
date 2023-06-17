import { Injectable } from '@angular/core';
import { ApiResponse, PaginationModel } from '@core/http/apis.model';
import { HttpService } from '@core/http/http/http.service';
import * as ASSIGNED_PROFILES_MODELS from './assigned-profile.model';
import * as ASSIGNED_PROFILES_CONFIGS from './assigned-profile.config';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { buildQueryString } from '@shared/helpers/build-query-string.helper';

@Injectable({
  providedIn: 'root',
})
export class AssignedProfilesService {
  constructor(private _http: HttpService) {}

  public getAllAssignedProfiles(
    pagination: PaginationConfigModel,
    filtration: ASSIGNED_PROFILES_MODELS.AssignedProfileFiltrationModel
  ): Observable<PaginationModel<ASSIGNED_PROFILES_MODELS.ProfilesModel>> {
    return this._http
      .post(
        `${
          ASSIGNED_PROFILES_CONFIGS.TEAMS_ENDPOINTS_BASE
        }/GetFilteredPage${buildQueryString(pagination)}`,
        filtration
      )
      .pipe(
        map(
          (
            res: ApiResponse<
              PaginationModel<ASSIGNED_PROFILES_MODELS.ProfilesModel>
            >
          ) => res.result
        )
      );
  }

  public deleteAssignedProfileRequest(id: string): Observable<any> {
    return this._http.post(
      `${
        ASSIGNED_PROFILES_CONFIGS.TEAMS_ENDPOINTS_BASE
      }/Delete${buildQueryString({ Id: id })}`
    );
  }

  public getAssignedProfileById(
    id: string
  ): Observable<ASSIGNED_PROFILES_MODELS.ProfilesModel> {
    return this._http
      .fetch(
        `${
          ASSIGNED_PROFILES_CONFIGS.PROFILE_ENDPOINTS_BASE
        }/GetProfileById${buildQueryString({ id })}`
      )
      .pipe(
        map(
          (res: ApiResponse<ASSIGNED_PROFILES_MODELS.ProfilesModel>) =>
            res.result
        )
      );
  }

  public getClients(): Observable<ASSIGNED_PROFILES_MODELS.Client> {
    return this._http
      .fetch(
        `${ASSIGNED_PROFILES_CONFIGS.TEAMS_ENDPOINTS_BASE}/GetMyInvolvedAccounts`
      )
      .pipe(
        map((res: ApiResponse<ASSIGNED_PROFILES_MODELS.Client>) => res.result)
      );
  }

  public getAllowedPortfolios(
    id: string
  ): Observable<ASSIGNED_PROFILES_MODELS.Portfolio> {
    return this._http
      .fetch(
        `${
          ASSIGNED_PROFILES_CONFIGS.TEAMS_ENDPOINTS_BASE
        }/GetMyInvolvedPortfolios${buildQueryString({
          accountId: id,
        })}`
      )
      .pipe(
        map(
          (res: ApiResponse<ASSIGNED_PROFILES_MODELS.Portfolio>) => res.result
        )
      );
  }

  public getAllowedTeams(
    filtration: ASSIGNED_PROFILES_MODELS.GetMyTeamsFilteration
  ): Observable<ASSIGNED_PROFILES_MODELS.Team> {
    return this._http
      .fetch(
        `${
          ASSIGNED_PROFILES_CONFIGS.TEAMS_ENDPOINTS_BASE
        }/GetMyInvolvedPlatforms${buildQueryString(filtration)}`
      )
      .pipe(
        map((res: ApiResponse<ASSIGNED_PROFILES_MODELS.Team>) => res.result)
      );
  }

  public endAssociation(
    payload: ASSIGNED_PROFILES_MODELS.EndAssociationModel
  ): Observable<boolean> {
    return this._http.post(
      `${ASSIGNED_PROFILES_CONFIGS.TEAMS_ENDPOINTS_BASE}/EndAssociation`,
      payload
    );
  }
  public editEndAssociation(
    payload: ASSIGNED_PROFILES_MODELS.EditEndAssociationModel
  ): Observable<boolean> {
    return this._http.post(
      `${ASSIGNED_PROFILES_CONFIGS.TEAMS_ENDPOINTS_BASE}/EditEndAssociation`,
      payload
    );
  }
  public getTerminationReasons() {
    return this._http
      .fetch(
        `${ASSIGNED_PROFILES_CONFIGS.LOOKUP_ENDPOINTS_BASE}/GetTerminationReasons`
      )
      .pipe(map((res) => res.result));
  }

  public getIsVoluntaryLeave() {
    return this._http
      .fetch(
        `${ASSIGNED_PROFILES_CONFIGS.LOOKUP_ENDPOINTS_BASE}/GetVoluntarilyReasons`
      )
      .pipe(map((res) => res.result));
  }

  public getDepartments() {
    return this._http
      .fetch(`Department/GetDepartments`)
      .pipe(map((res) => res.result));
  }

  public getDepartmentsByPlatformId(platformId: string) {
    return this._http
      .fetch(
        `AssignedProfile/GetMyAllowedDepartments${buildQueryString({
          platformId,
        })}`
      )
      .pipe(map((res) => res.result));
  }

  public importExcel(file: FormData) {
    return this._http
      .post(`AssignedProfile/ImportFromExcel`, file)
      .pipe(map((res) => res.result));
  }

  public exportExcel(
    filtration: ASSIGNED_PROFILES_MODELS.AssignedProfileFiltrationModel
  ) {
    return this._http
      .post(
        `AssignedProfile/ExportToExcel`,
        filtration,
        { observe: 'response', responseType: 'blob' }
      )
  }

  public exportTemplateExcel() {
    return this._http
      .post(
        `AssignedProfile/ExcelImportTemplate`,
        {},
        { observe: 'response', responseType: 'blob' }
      )
  }

  public changeContractType(body: ASSIGNED_PROFILES_MODELS.ChangeContractTypeBodyModel): Observable<ASSIGNED_PROFILES_MODELS.ProfilesModel> {
    return this._http.post(`${ASSIGNED_PROFILES_CONFIGS.TEAMS_ENDPOINTS_BASE}/ChangeContractType`, body).pipe(map((res: ApiResponse< ASSIGNED_PROFILES_MODELS.ProfilesModel>)=> res.result))
  }
}
