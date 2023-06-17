import { buildQueryString } from '@shared/helpers/build-query-string.helper';
import { Injectable } from '@angular/core';
import { HttpService } from '@core/http/http/http.service';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import * as BILLING_CYCLES_CONFIG from './monthly-billing-cycle.config'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginationModel } from '@core/http/apis.model';
import * as MONTHLY_BILLING_MODELS from './monthly-billing-cycle.models'
import { ApiResponse } from '@shared/models/api-response';
@Injectable({
  providedIn: 'root'
})
export class MonthlyBillingCycleService {

  constructor(private _http: HttpService) { }

  public getMonthlyBillingCycles(pagination: PaginationConfigModel): Observable<PaginationModel<MONTHLY_BILLING_MODELS.MonthlyBillingCycleModel>> {
    return this._http.post(`${BILLING_CYCLES_CONFIG.BILLING_CYCLES_END_POINT}/GetMonthlyBillingCycles${buildQueryString({ ...pagination })}`).pipe(
      map((res: ApiResponse<PaginationModel<MONTHLY_BILLING_MODELS.MonthlyBillingCycleModel>>) => res.result)
    )
  }
  public exportMonthlyBillingCyclesAsExcel() {
    return this._http.post(`${BILLING_CYCLES_CONFIG.BILLING_CYCLES_END_POINT}/ExportMonthlyBillingCyclesAsExcel`, {}, { observe: 'response', responseType: 'blob' })
  }

  public getMonthlyBillingCyclesDetails(pagination: PaginationConfigModel, filtration: MONTHLY_BILLING_MODELS.MonthlyBillingCycleDetailsFiltrationModel): Observable<PaginationModel<MONTHLY_BILLING_MODELS.MonthlyBillingCycleDetailsModel>> {
    return this._http.post(`${BILLING_CYCLES_CONFIG.BILLING_CYCLES_END_POINT}/GetMonthlyBillingCyclesDetails${buildQueryString({ ...pagination })}`, { ...filtration }).pipe(
      map((res: ApiResponse<PaginationModel<MONTHLY_BILLING_MODELS.MonthlyBillingCycleDetailsModel>>) => res.result)
    )
  }

  public exportMonthlyBillingCyclesDetailsAsExcel(filtration: MONTHLY_BILLING_MODELS.MonthlyBillingCycleDetailsFiltrationModel) {
    return this._http.post(`${BILLING_CYCLES_CONFIG.BILLING_CYCLES_END_POINT}/ExportMonthlyBillingCyclesDetailsAsExcel`, {...filtration}, { observe: 'response', responseType: 'blob' })
  }

  public GetUnassociatedSubs(pagination: PaginationConfigModel, unassociatedSubsFiltration: MONTHLY_BILLING_MODELS.MonthlyBillingCycleDetailsFiltrationModel):Observable<PaginationModel<MONTHLY_BILLING_MODELS.UnassociatedSubsModel>> {
    return this._http.post(`${BILLING_CYCLES_CONFIG.ASSIGNED_PROFILES_END_POINT}/GetUnassociatedSubs${buildQueryString({ ...pagination })}`, { ...unassociatedSubsFiltration }).pipe(
      map((res: ApiResponse<PaginationModel<MONTHLY_BILLING_MODELS.UnassociatedSubsModel>>) => res.result)
    )
  }
  public AddDiscountForResource(
    payload: MONTHLY_BILLING_MODELS.DiscountModel
  ): Observable<boolean> {
    return this._http.post(
      `${BILLING_CYCLES_CONFIG.BILLING_CYCLES_END_POINT}/AddDiscountForResource`,
      payload
    );
  }
  public DeleteDiscountForResource(assignedProfileId: string): Observable<any> {
    return this._http.post(
      `${
        BILLING_CYCLES_CONFIG.BILLING_CYCLES_END_POINT
      }/DeleteDiscountForResource${buildQueryString({ assignedProfileId: assignedProfileId })}`
    );
  }
  public UpdateDiscountForResource(
    payload: MONTHLY_BILLING_MODELS.DiscountModel
  ): Observable<boolean> {
    return this._http.post(
      `${BILLING_CYCLES_CONFIG.BILLING_CYCLES_END_POINT}/UpdateDiscountForResource`,
      payload
    );
  }
}
