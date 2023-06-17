import { Injectable } from '@angular/core';
import { ApiResponse, PaginationModel } from '@core/http/apis.model';
import { HttpService } from '@core/http/http/http.service';
import { StorageService } from '@core/services/storage/storage.service';
import { buildQueryString } from '@shared/helpers/build-query-string.helper';
import { encrypt } from '@shared/helpers/crypto.helper';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { OrgEntityModel, OrgModel, OrgSalaryLevelModel } from './organization.model';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  constructor(
    private _http: HttpService,
    private _storage: StorageService
  ) { }


  public getMyOrganization(): Observable<OrgModel> {
    return this._http.fetch(`Auth/GetMyOrganization`).pipe(
      map((res: ApiResponse<OrgModel>) => {
        return res.result;
      }),
    )
  }




  public getOrgEntities(): Observable<OrgEntityModel[]> {

    return this._http.post(`Entities/GetAllEntities${buildQueryString({pageSize: 1000})}`, {}).pipe(
      map((res: ApiResponse<PaginationModel<OrgEntityModel>>) => res.result.records),
    )
  }

  public getOrgSalaryLevels(): Observable<OrgSalaryLevelModel[]> {
    return this._http.post(`SalaryLevels/GetSalaryLevels${buildQueryString({pageSize: 1000})}`, {}).pipe(
      map((res: ApiResponse<PaginationModel<OrgSalaryLevelModel>>) => res.result.records),
    )
  }

}
