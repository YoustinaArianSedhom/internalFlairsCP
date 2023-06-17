import { Injectable } from '@angular/core';
import { ApiResponse, PaginationModel } from '@core/http/apis.model';
import { HttpService } from '@core/http/http/http.service';
import * as MY_TASKS_MODELS from './my-tickets.model';
import * as MY_TASKS_CONFIGS from './my-tickets.config';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { buildQueryString } from '@shared/helpers/build-query-string.helper';

@Injectable({
  providedIn: 'root',
})
export class MyTicketsService {
  constructor(private _http: HttpService) {}

  public getMyTickets(
    pagination: PaginationConfigModel,
    filtration: MY_TASKS_MODELS.RequestTeamModel
  ): Observable<PaginationModel<MY_TASKS_MODELS.MyTicketModel>> {
    return this._http
      .post(`Ticket/GetFilteredPage${buildQueryString(pagination)}`, filtration)
      .pipe(
        map(
          (
            res: ApiResponse<PaginationModel<MY_TASKS_MODELS.MyTicketModel>>
          ) => {
            return res.result;
          }
        )
      );
  }

  public getMyInternalTickets(
    pagination: PaginationConfigModel,
    filtration: MY_TASKS_MODELS.RequestTeamModel
  ): Observable<PaginationModel<MY_TASKS_MODELS.MyTicketModel>> {
    return this._http
      .post(
        `Ticket/GetInternalFilteredPage${buildQueryString(pagination)}`,
        filtration
      )
      .pipe(
        map(
          (
            res: ApiResponse<PaginationModel<MY_TASKS_MODELS.MyTicketModel>>
          ) => {
            return res.result;
          }
        )
      );
  }

  public getMyAllowedClients(): Observable<MY_TASKS_MODELS.Client> {
    return this._http.fetch(`AssignedProfile/GetMyInvolvedAccounts`).pipe(
      map((res: ApiResponse<MY_TASKS_MODELS.Client>) => {
        return res.result;
      })
    );
  }

  public getMyAllowedPortfolios(
    clientId: string
  ): Observable<MY_TASKS_MODELS.AssignedPortfolios> {
    return this._http
      .fetch(
        `AssignedProfile/GetMyInvolvedPortfolios${buildQueryString({
          accountId: clientId,
        })}`
      )
      .pipe(
        map((res: ApiResponse<MY_TASKS_MODELS.AssignedPortfolios>) => {
          return res.result;
        })
      );
  }

  public GetMyallowedPlatforms(
    accountId: string,
    portfolioID: string
  ): Observable<MY_TASKS_MODELS.AssignedPortfolios> {
    return this._http
      .fetch(
        `Ticket/GetMyallowedPlatforms${buildQueryString({
          accountId,
          portfolioID,
        })}`
      )
      .pipe(
        map((res: ApiResponse<MY_TASKS_MODELS.AssignedPortfolios>) => {
          return res.result;
        })
      );
  }

  public takeAction(
    takeActionsParams: MY_TASKS_MODELS.MyTasksActionTaken
  ): Observable<MY_TASKS_MODELS.MyTicketModel> {
    return this._http
      .post(`Ticket/TakeAction${buildQueryString(takeActionsParams)}`)
      .pipe(
        map((res: ApiResponse<MY_TASKS_MODELS.MyTicketModel>) => {
          return res.result;
        })
      );
  }

  public getSkills(query: string): Observable<MY_TASKS_MODELS.Skill> {
    return this._http
      .fetch(
        `${MY_TASKS_CONFIGS.Skills_ENDPOINTS_BASE}/Find${buildQueryString({
          query,
        })}`
      )
      .pipe(
        map((res: ApiResponse<MY_TASKS_MODELS.Skill>) => {
          return res.result;
        })
      );
  }

  public getContacts(query: string): Observable<MY_TASKS_MODELS.contactModel> {
    return this._http
      .fetch(`Ticket/contact/find${buildQueryString({ query })}`)
      .pipe(
        map((res: ApiResponse<MY_TASKS_MODELS.contactModel>) => {
          return res.result;
        })
      );
  }

  public getRoles(query: string): Observable<MY_TASKS_MODELS.roleModel> {
    return this._http
      .fetch(
        `${MY_TASKS_CONFIGS.TICKETS_ENDPOINTS_BASE}/role/find${buildQueryString(
          { query }
        )}`
      )
      .pipe(
        map((res: ApiResponse<MY_TASKS_MODELS.roleModel>) => {
          return res.result;
        })
      );
  }
}
