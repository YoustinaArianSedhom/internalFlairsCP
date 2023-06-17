import { Injectable } from '@angular/core';
import { HttpService } from '@core/http/http/http.service';
import { Observable } from 'rxjs';
import * as MY_TEAM_MODELS from './my-team.models';
import * as MY_TEAM_CONFIG from './my-team.config';
import { buildQueryString } from '@shared/helpers/build-query-string.helper';
import { ApiResponse, PaginationModel } from '@core/http/apis.model';
import { map } from 'rxjs/operators';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class MyTeamService {

  constructor(private _http: HttpService) { }

  public getManager(query: string): Observable<MY_TEAM_MODELS.ManagerModel[]> {
    return this._http.fetch(`${MY_TEAM_CONFIG.MY_TEAM_END_POINT}/GetManagers${buildQueryString({ query })}`).pipe(
      map((res: ApiResponse<MY_TEAM_MODELS.ManagerModel[]>) => res.result)
    )
  }

  public getMyTeamPage(pagination: PaginationConfigModel, filtration: MY_TEAM_MODELS.MyTeamFiltrationModel): Observable<PaginationModel<MY_TEAM_MODELS.MyTeamModel>> {
    return this._http.post(`${MY_TEAM_CONFIG.MY_TEAM_END_POINT}/GetMyTeamPage${buildQueryString({ ...pagination })}`, filtration).pipe(
      map((res: ApiResponse<PaginationModel<MY_TEAM_MODELS.MyTeamModel>>) => res.result)
    )
  }
}
