import { Injectable } from '@angular/core';
import { ApiResponse, PaginationModel } from '@core/http/apis.model';
import { HttpService } from '@core/http/http/http.service';
import * as MY_TASKS_MODELS from './my-accounts.model';
import * as MY_TASKS_CONFIGS from './my-accounts.config';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { buildQueryString } from '@shared/helpers/build-query-string.helper';

@Injectable({
  providedIn: 'root',
})
export class MyTeamsService {
  constructor(private _http: HttpService) {}

  public getMyTeams(
    pagination: PaginationConfigModel,
    filtration: MY_TASKS_MODELS.RequestTeamModel
  ): Observable<PaginationModel<MY_TASKS_MODELS.MyTeamModel>> {
    return this._http
      .post(
        `AssignedProfile/GetPageAssignedProfile${buildQueryString(pagination)}`,
        filtration
      )
      .pipe(
        map(
          (res: ApiResponse<PaginationModel<MY_TASKS_MODELS.MyTeamModel>>) => {
            return res.result;
          }
        )
      );
  }

  public getMyAllowedPortfolios(
    clientID: string
  ): Observable<MY_TASKS_MODELS.AssignedPortfolios> {
    return this._http
      .fetch(
        `AssignedProfile/GetMyInvolvedPortfolios${buildQueryString({
          accountId:clientID,
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
        `AssignedProfile/GetMyInvolvedPlatforms${buildQueryString({
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
  ): Observable<MY_TASKS_MODELS.MyTeamModel> {
    return this._http
      .post(
        `${MY_TASKS_CONFIGS.TEAMS_ENDPOINTS_BASE}/TakeAction${buildQueryString(
          takeActionsParams
        )}`
      )
      .pipe(
        map((res: ApiResponse<MY_TASKS_MODELS.MyTeamModel>) => {
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
}
