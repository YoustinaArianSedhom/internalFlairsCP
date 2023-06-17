import { Injectable } from '@angular/core';
import { ApiResponse, PaginationModel } from '@core/http/apis.model';
import { HttpService } from '@core/http/http/http.service';
import * as PO_MODELS from './po.models';
import * as PO_CONFIGS from './po.config';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { buildQueryString } from '@shared/helpers/build-query-string.helper';



@Injectable({
  providedIn: 'root',
})
export class PoService {

  private PO_Endpoint = 'PO';
  private PROFILE = 'Profile';
  private CLIENT_PROFILE = 'ClientProfile';
  private ASSIGNEDPROFILE = 'AssignedProfile';
  private LOOKUP = 'Lookup';
  constructor(private _http: HttpService) { }

  public getDepartments() {
    return this._http
      .fetch(`Department/GetDepartments`)
      .pipe(map((res) => res.result));
  }
  public getAllTeams(model: PO_MODELS.TeamFiltrationModel) {
    return this._http
      .fetch(
        `${PO_CONFIGS.TEAMS_ENDPOINTS_BASE}/GetMyInvolvedPlatforms${buildQueryString({ ...model })}`
      )
      .pipe(map((res: ApiResponse<PO_MODELS.Team[]>) => res.result));
  }

  public getClients(value: string) {
    return this._http.fetch(
      `${PO_CONFIGS.TEAMS_ENDPOINTS_BASE}/GetMyInvolvedAccounts${buildQueryString({
        query: value,
      })}`
    ).pipe(map((res: ApiResponse<PO_MODELS.Client[]>) => res.result));
  }

  public getAllPortfolios(value: string) {
    return this._http
      .fetch(
        `${PO_CONFIGS.TEAMS_ENDPOINTS_BASE}/GetMyInvolvedPortfolios${buildQueryString({
          accountId: value,
        })}`
      )
      .pipe(
        map((res: ApiResponse<PO_MODELS.Portfolio[]>) => res.result)
      );
  }

  public searchAllPortfolios(value: string, search: string) {
    return this._http
      .fetch(
        `${PO_CONFIGS.TEAMS_ENDPOINTS_BASE}/GetMyInvolvedPortfolios${buildQueryString({
          accountId: value,
          query: search,
        })}`
      )
      .pipe(
        map((res: ApiResponse<PO_MODELS.Portfolio[]>) => res.result)
      );
  }

  public AddPO(formData: FormData): Observable<boolean> {
    return this._http.post(`${this.PO_Endpoint}/Create`, formData).pipe(
      map((res: ApiResponse<boolean>) => res.result)
    )
  }

  public UpdatedPO(formData: FormData): Observable<boolean> {
    return this._http.post(`${this.PO_Endpoint}/Update`, formData).pipe(
      map((res: ApiResponse<boolean>) => res.result)
    )
  }
  //internal Manager filterd by Platformid
  public getAllInternalManagers(search: string, body: PO_MODELS.FliterManger): Observable<PO_MODELS.InternalAdminModel[]> {
    return this._http
      .post(
        `${this.PROFILE}/FindByPlatformDepartment${buildQueryString({ query: search })}`, body).pipe(
          map((res: ApiResponse<PO_MODELS.InternalAdminModel[]>) => res.result)
        )
  }
  //External Manager filterd by Platformid 
  public getExternalManager(search: string, body: PO_MODELS.FliterManger): Observable<PO_MODELS.ExternalAdminModel[]> {
    return this._http
      .post(
        `${this.CLIENT_PROFILE}/FindByPlatformDepartment${buildQueryString({
          query: search
        })}`, body
      ).pipe(
        map((res: ApiResponse<PO_MODELS.ExternalAdminModel[]>) => res.result)
      )
  }


  public getPOList(pagination: PaginationConfigModel, searchQuery: string): Observable<PaginationModel<PO_MODELS.POList>> {
    return this._http.post(`${this.PO_Endpoint}/GetFilteredPage${buildQueryString({ ...pagination })}`, { searchQuery }).pipe(
      map((res: ApiResponse<PaginationModel<PO_MODELS.POList>>) => res.result)
    )
  }

  public getDepartmentsByPlatformId(platformId: string): Observable<PO_MODELS.Departments[]> {
    return this._http
      .fetch(
        `${this.ASSIGNEDPROFILE}/GetMyAllowedDepartments${buildQueryString({
          platformId,
        })}`
      )
      .pipe(map((res: ApiResponse<PO_MODELS.Departments[]>) => res.result));
  }
  public getPObyId(poId: string): Observable<PO_MODELS.PoModelRecord> {
    return this._http
      .post(
        `${this.PO_Endpoint}/GetById${buildQueryString({
          id: poId
        })}`
      ).pipe(
        map((res: ApiResponse<PO_MODELS.PoModelRecord>) => res.result)
      )
  }

  public getCurrencies(query: string): Observable<PO_MODELS.Currency[]> {
    return this._http
      .fetch(
        `${this.LOOKUP}/GetCurruncies${buildQueryString({
          query
        })}`
      )
      .pipe(map((res: ApiResponse<PO_MODELS.Currency[]>) => res.result));
  }

  public getAssignedProfileRoles(): Observable<PO_MODELS.AssignedProfileRolesModel[]> {
    return this._http.fetch(`${this.LOOKUP}/GetAssignedProfileRoles`).pipe(
      map((res: ApiResponse<PO_MODELS.AssignedProfileRolesModel[]>) => res.result));
  }

  public getLocations(): Observable<PO_MODELS.LocationsModel[]> {
    return this._http.fetch(`${this.LOOKUP}/GetLocations`).pipe(
      map((res: ApiResponse<PO_MODELS.LocationsModel[]>) => res.result));
  }

  public downloadNewAssociationTemplate(): Observable<string> {
    return this._http.fetch(`${this.ASSIGNEDPROFILE}/DownloadNewAssociationTemplate`).pipe(
      map((res: ApiResponse<string>) => res.result))
  }

  public importNewAssociationFromExcel(body: FormData): Observable<string[]> {
   return this._http.post(`${this.ASSIGNEDPROFILE}/ImportNewAssociationFromExcel`, body).pipe(
      map((res : ApiResponse<string[]>) => res.result)
    )
  }

}