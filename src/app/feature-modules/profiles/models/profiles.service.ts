import { Injectable } from '@angular/core';
import { ApiResponse, PaginationModel } from '@core/http/apis.model';
import { HttpService } from '@core/http/http/http.service';
import * as MY_TASKS_MODELS from './profiles.model';
import * as MY_TASKS_CONFIGS from './profiles.config';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { buildQueryString } from '@shared/helpers/build-query-string.helper';

@Injectable({
  providedIn: 'root',
})
export class ProfilesService {
  constructor(private _http: HttpService) {}

  public getProfiles(
    pagination: PaginationConfigModel,
    filtration: MY_TASKS_MODELS.RequestTeamModel
  ): Observable<PaginationModel<MY_TASKS_MODELS.ProfilesModel>> {
    return this._http
      .post(
        `${
          MY_TASKS_CONFIGS.TEAMS_ENDPOINTS_BASE
        }/GetFilteredPage${buildQueryString(pagination)}`,
        filtration
      )
      .pipe(
        map(
          (
            res: ApiResponse<PaginationModel<MY_TASKS_MODELS.ProfilesModel>>
          ) => res.result
        )
      );
  }

  public getProfileById(id: string): Observable<MY_TASKS_MODELS.ProfilesModel> {
    return this._http
      .fetch(
        `${
          MY_TASKS_CONFIGS.TEAMS_ENDPOINTS_BASE
        }/GetProfileById${buildQueryString({ id })}`
      )
      .pipe(
        map((res: ApiResponse<MY_TASKS_MODELS.ProfilesModel>) =>  res.result)
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
        map((res: ApiResponse<MY_TASKS_MODELS.Skill>) => res.result)
      );
  }

}
