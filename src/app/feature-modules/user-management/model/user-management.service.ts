import { Injectable } from '@angular/core';
import { ApiResponse, PaginationModel } from '@core/http/apis.model';
import { HttpService } from '@core/http/http/http.service';
import { buildQueryString } from '@shared/helpers/build-query-string.helper';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { USER_MANAGEMENT_ENDPOINTS_BASE } from './user-management.config';
import * as USER_MANAGEMENT_MODELS from './user-management.models'; 

@Injectable()
export class UserManagementService {

  constructor(
    private _http: HttpService
  ) { }




  public getUsers(pagination: PaginationConfigModel, filtration: USER_MANAGEMENT_MODELS.UsersManagementFiltrationModel): Observable<PaginationModel<USER_MANAGEMENT_MODELS.UserModel>> {
    return this._http.post(`${USER_MANAGEMENT_ENDPOINTS_BASE}/GetAllEmployees${buildQueryString(pagination)}`, filtration)
    .pipe(
      map((res: ApiResponse<PaginationModel<USER_MANAGEMENT_MODELS.UserModel>>) => res.result)
    )
  }
  
  public updateUserPermissions(body: USER_MANAGEMENT_MODELS.userPermissionsBodyModel): Observable<USER_MANAGEMENT_MODELS.UserModel> {
    return this._http.post(`${USER_MANAGEMENT_ENDPOINTS_BASE}/UpdateProfilePermissions`, body).pipe(
      map((res: ApiResponse<USER_MANAGEMENT_MODELS.UserModel>) => res.result)
    )
  }
}
