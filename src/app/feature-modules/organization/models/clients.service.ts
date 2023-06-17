import { Injectable } from '@angular/core';
import { ApiResponse, PaginationModel } from '@core/http/apis.model';
import { HttpService } from '@core/http/http/http.service';
import * as Clients_MODELS from './clients.models';
import * as Clients_CONFIGS from './clients.config';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { buildQueryString } from '@shared/helpers/build-query-string.helper';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  constructor(private _http: HttpService) {}

  public getClients(
    pagination: PaginationConfigModel,
    filtration: Clients_MODELS.Filtration
  ): Observable<PaginationModel<Clients_MODELS.Client>> {
    return this._http
      .post(
        `${
          Clients_CONFIGS.Clients_ENDPOINTS_BASE
        }/GetFilteredPage${buildQueryString(pagination)}`,
        filtration
      )
      .pipe(
        map((res: ApiResponse<PaginationModel<Clients_MODELS.Client>>) => {
          return res.result;
        })
      );
  }

  public getTree(): Observable<Clients_MODELS.Tree> {
    // console.log('here');
    return this._http
      .fetch(`${Clients_CONFIGS.Clients_ENDPOINTS_BASE}/GetTree`)
      .pipe(
        map((res: ApiResponse<Clients_MODELS.Tree>) => {
          return res.result;
        })
      );
  }

  public getAdmins(
    pagination: PaginationConfigModel,
    id: string
  ): Observable<PaginationModel<Clients_MODELS.Client>> {
    return this._http
      .post(
        `${
          Clients_CONFIGS.Admins_ENDPOINTS_BASE
        }/GetFilteredPage${buildQueryString(pagination)}`,
        { platformsIds: id }
      )
      .pipe(
        map((res: ApiResponse<PaginationModel<Clients_MODELS.Client>>) => {
          return res.result;
        })
      );
  }

  public getClientsIDS(query: string): Observable<Clients_MODELS.Client> {
    return this._http
      .fetch(
        `${Clients_CONFIGS.Clients_ENDPOINTS_BASE}/Find${buildQueryString({
          query,
        })}`
      )
      .pipe(
        map((res: ApiResponse<Clients_MODELS.Client>) => {
          return res.result;
        })
      );
  }

  public getPortfolios(
    pagination: PaginationConfigModel,
    filtration: Clients_MODELS.Filtration
  ): Observable<PaginationModel<Clients_MODELS.Client>> {
    // console.log('service', filtration);
    return this._http
      .post(
        `${
          Clients_CONFIGS.Portfolios_ENDPOINTS_BASE
        }/GetFilteredPage${buildQueryString(pagination)}`,
        filtration
      )
      .pipe(
        map((res: ApiResponse<PaginationModel<Clients_MODELS.Portfolios>>) => {
          return res.result;
        })
      );
  }

  public getPortfoliosIDS(
    query: string
  ): Observable<Clients_MODELS.Portfolios> {
    return this._http
      .fetch(
        `${Clients_CONFIGS.Portfolios_ENDPOINTS_BASE}/Find${buildQueryString({
          query,
        })}`
      )
      .pipe(
        map((res: ApiResponse<Clients_MODELS.Portfolios>) => {
          return res.result;
        })
      );
  }

  public getTeams(
    pagination: PaginationConfigModel,
    filtration: Clients_MODELS.Filtration
  ): Observable<PaginationModel<Clients_MODELS.Teams>> {
    return this._http
      .post(
        `${
          Clients_CONFIGS.Teams_ENDPOINTS_BASE
        }/GetFilteredPage${buildQueryString(pagination)}`,
        filtration
      )
      .pipe(
        map((res: ApiResponse<PaginationModel<Clients_MODELS.Teams>>) => {
          return res.result;
        })
      );
  }

  public getDepartments(
  ): Observable<Clients_MODELS.Department[]> {
    return this._http
      .fetch(
        `Department/GetDepartments`
      )
      .pipe(
        map((res: ApiResponse<Clients_MODELS.Department[]>) => {
          return res.result;
        })
      );
  }

  public getTeamsIDS(query: string): Observable<Clients_MODELS.Teams> {
    return this._http
      .fetch(
        `${Clients_CONFIGS.Teams_ENDPOINTS_BASE}/Find${buildQueryString({
          query,
        })}}`
      )
      .pipe(
        map((res: ApiResponse<Clients_MODELS.Teams>) => {
          return res.result;
        })
      );
  }

  public getAssignedProfileByTeam(
    pagination: PaginationConfigModel,
    filtration: Clients_MODELS.Filtration
  ): Observable<PaginationModel<Clients_MODELS.AssignedProfile>> {
    return this._http
      .post(
        `${
          Clients_CONFIGS.AssignedProfiles_ENDPOINTS_BASE
        }/GetFilteredPage${buildQueryString(pagination)}`,
        filtration
      )
      .pipe(
        map(
          (
            res: ApiResponse<PaginationModel<Clients_MODELS.AssignedProfile>>
          ) => {
            return res.result;
          }
        )
      );
  }

  public getEntities(): Observable<Clients_MODELS.Entities> {
    return this._http
      .fetch(`${Clients_CONFIGS.Clients_ENDPOINTS_BASE}/GetEntitiesCounts`)
      .pipe(
        map((res: ApiResponse<Clients_MODELS.Entities>) => {
          return res.result;
        })
      );
  }

  public getClientById(id: string): Observable<Clients_MODELS.Client> {
    return this._http
      .fetch(
        `${Clients_CONFIGS.Clients_ENDPOINTS_BASE}/GetById${buildQueryString({
          accountId: id,
        })}`
      )
      .pipe(
        map((res: ApiResponse<Clients_MODELS.Client>) => {
          return res.result;
        })
      );
  }

  public getPortfolioById(id: string): Observable<Clients_MODELS.Portfolios> {
    return this._http
      .fetch(
        `${Clients_CONFIGS.Portfolios_ENDPOINTS_BASE}/GetById${buildQueryString(
          {
            portfolioId: id,
          }
        )}`
      )
      .pipe(
        map((res: ApiResponse<Clients_MODELS.Portfolios>) => {
          return res.result;
        })
      );
  }


  public getDepartmentByPlatformId(id: string): Observable<Clients_MODELS.DepartmentBreadcrumb[]> {
    return this._http
      .fetch(
        `Department/GetDepartmentsByPlatformId${buildQueryString(
          {
            platformId : id,
          }
        )}`
      )
      .pipe(
        map((res: ApiResponse<Clients_MODELS.DepartmentBreadcrumb[]>) => {
          return res.result;
        })
      );
  }

  public getTeamById(id: string): Observable<Clients_MODELS.Teams> {
    return this._http
      .fetch(
        `${Clients_CONFIGS.Teams_ENDPOINTS_BASE}/GetById${buildQueryString({
          teamId: id,
        })}`
      )
      .pipe(
        map((res: ApiResponse<Clients_MODELS.Teams>) => {
          return res.result;
        })
      );
  }
}
