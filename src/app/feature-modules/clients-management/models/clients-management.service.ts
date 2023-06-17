import { Injectable } from '@angular/core';
import { ApiResponse, PaginationModel } from '@core/http/apis.model';
import { HttpService } from '@core/http/http/http.service';
import * as CLIENTS_MANAGEMENT_MODELS from './clients-management.models';
import * as CLIENTS_MANAGEMENT_CONFIGS from './clients-management.config';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { buildQueryString } from '@shared/helpers/build-query-string.helper';

@Injectable({
  providedIn: 'root',
})
export class ClientsManagementService {
  constructor(private _http: HttpService) {}

  public getClients(
    pagination: PaginationConfigModel,
    filtration: CLIENTS_MANAGEMENT_MODELS.Filtration
  ): Observable<PaginationModel<CLIENTS_MANAGEMENT_MODELS.Client>> {
    return this._http
      .post(
        `${
          CLIENTS_MANAGEMENT_CONFIGS.Clients_ENDPOINTS_BASE
        }/GetFilteredPage${buildQueryString(pagination)}`,
        filtration
      )
      .pipe(
        map(
          (
            res: ApiResponse<PaginationModel<CLIENTS_MANAGEMENT_MODELS.Client>>
          ) => res.result
        )
      );
  }

  public getAdmins(
    pagination: PaginationConfigModel,
    payload: CLIENTS_MANAGEMENT_MODELS.Filtration
  ): Observable<PaginationModel<CLIENTS_MANAGEMENT_MODELS.Client>> {
    return this._http
      .post(
        `${
          CLIENTS_MANAGEMENT_CONFIGS.Admins_ENDPOINTS_BASE
        }/GetFilteredPage${buildQueryString(pagination)}`,
        payload
      )
      .pipe(
        map(
          (
            res: ApiResponse<PaginationModel<CLIENTS_MANAGEMENT_MODELS.Client>>
          ) => res.result
        )
      );
  }

  public getInternalAdmins(
    pagination: PaginationConfigModel,
    payload: CLIENTS_MANAGEMENT_MODELS.InternalAdminsFiltration
  ): Observable<PaginationModel<CLIENTS_MANAGEMENT_MODELS.InternalAdmin>> {
    return this._http
      .post(
        `${
          CLIENTS_MANAGEMENT_CONFIGS.Internal_Admin_ENDPOINTS_BASE
        }/GetEmployeesFilteredPage${buildQueryString(pagination)}`,
        payload
      )
      .pipe(
        map(
          (
            res: ApiResponse<
              PaginationModel<CLIENTS_MANAGEMENT_MODELS.InternalAdmin>
            >
          ) => res.result,
        )
      );
  }

  public getClientsIDS(): Observable<CLIENTS_MANAGEMENT_MODELS.Client> {
    return this._http.fetch(`AssignedProfile/GetMyInvolvedAccounts`).pipe(
      map((res: ApiResponse<CLIENTS_MANAGEMENT_MODELS.Client>) => res.result)
    );
  }

  public getClientById(
    id: string
  ): Observable<CLIENTS_MANAGEMENT_MODELS.Client> {
    return this._http
      .fetch(
        `${
          CLIENTS_MANAGEMENT_CONFIGS.Clients_ENDPOINTS_BASE
        }/GetById${buildQueryString({
          accountId: id,
        })}`
      )
      .pipe(
        map((res: ApiResponse<CLIENTS_MANAGEMENT_MODELS.Client>) => res.result)
      );
  }

  public getAllowedPortfolios(
    id: string
  ): Observable<CLIENTS_MANAGEMENT_MODELS.Portfolios> {
    return this._http
      .fetch(
        `AssignedProfile/GetMyInvolvedPortfolios${buildQueryString({
          accountId: id,
        })}`
      )
      .pipe(
        map((res: ApiResponse<CLIENTS_MANAGEMENT_MODELS.Portfolios>) => res.result)
      );
  }

  public getAllowedTeams(
    filtration: CLIENTS_MANAGEMENT_MODELS.GetMyTeamsFilteration
  ): Observable<CLIENTS_MANAGEMENT_MODELS.Teams> {
    return this._http
      .fetch(`AssignedProfile/GetMyallowedPlatforms${buildQueryString(filtration)}`)
      .pipe(
        map((res: ApiResponse<CLIENTS_MANAGEMENT_MODELS.Teams>) => res.result)
      );
  }
}
