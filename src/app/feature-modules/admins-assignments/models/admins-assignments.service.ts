import { buildQueryString } from '@shared/helpers/build-query-string.helper';
import { Injectable } from '@angular/core';
import { PaginationModel } from '@core/http/apis.model';
import { HttpService } from '@core/http/http/http.service';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { Observable } from 'rxjs';
import * as ADMINS_ASSIGNMENTS_MODELS from './admins-assignments.models'
import { ApiResponse } from '../../../core/http/apis.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminsAssignmentsService {
  private CLIENT_PROFILE_APPOINTMENT_Endpoint = 'ClientProfileAppointment';
  private CLIENT_PROFILE = 'ClientProfile';
  private PROFILE = 'Profile'
  constructor(private _http: HttpService) { }

  public getSchedules(pagination: PaginationConfigModel): Observable<PaginationModel<ADMINS_ASSIGNMENTS_MODELS.adminModel>> {
    return this._http.post(`${this.CLIENT_PROFILE_APPOINTMENT_Endpoint}/GetSchedules${buildQueryString({...pagination})}`).pipe(
      map((res: ApiResponse<PaginationModel<ADMINS_ASSIGNMENTS_MODELS.adminModel>>)=> res.result)
    )
  }
//Fetch all external admins API
  public getFilteredPage(): Observable<ADMINS_ASSIGNMENTS_MODELS.ExternalAdminModel[]>{
    return this._http.post(`${this.CLIENT_PROFILE}/GetFilteredPage${buildQueryString({pageSize: 9999, pageIndex: 0})}`).pipe(
      map((res: ApiResponse<ADMINS_ASSIGNMENTS_MODELS.ExternalAdminModel[]>)=> res.result['records'])
    )
  }

  //Fetch all internal admins API
  public getInternalAdmins(clientProfileId: string): Observable<ADMINS_ASSIGNMENTS_MODELS.InternalAdminModel[]>{
    return this._http.post(`${this.PROFILE}/GetFilteredPage${buildQueryString({pageSize: 9999, pageIndex: 0})}`,{clientProfileId}).pipe(
      map((res: ApiResponse<ADMINS_ASSIGNMENTS_MODELS.InternalAdminModel[]>)=> res.result['records'])
    )
  }

  // Schedule an admin
  public schedule(body: ADMINS_ASSIGNMENTS_MODELS.adminAssignmentFormBodyModel): Observable<boolean>{
    return this._http.post(`${this.CLIENT_PROFILE_APPOINTMENT_Endpoint}/Schedule`,{...body}).pipe(
      map((res: ApiResponse<boolean>)=> res.result)
    )
  }
  //Unschedule an admin
  public unschedule(id: string): Observable<boolean>{
    return this._http.post(`${this.CLIENT_PROFILE_APPOINTMENT_Endpoint}/Unschedule${buildQueryString({id})}`).pipe(
      map((res: ApiResponse<boolean>)=> res.result)
    )
  }
  
}
