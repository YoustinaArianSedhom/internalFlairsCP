import { Injectable } from '@angular/core';
import { PaginationModel, ApiResponse } from '@core/http/apis.model';
import { HttpService } from '@core/http/http/http.service';
import { buildQueryString } from '@shared/helpers/build-query-string.helper';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as BILLING_CYCLES from './billing-cycles.models'

@Injectable({
  providedIn: 'root'
})
export class BillingCyclesService {
  private BILLING_CYCLE_Endpoint = 'BillingCycle';

  constructor(private _http: HttpService) { }

  public getFilteredPage(pagination: PaginationConfigModel, searchQuery:string): Observable<PaginationModel<BILLING_CYCLES.BillingCycleModel>> {
    return this._http.post(`${this.BILLING_CYCLE_Endpoint}/GetFilteredPage${buildQueryString({...pagination})}`,{searchQuery}).pipe(
      map((res: ApiResponse<PaginationModel<BILLING_CYCLES.BillingCycleModel>>)=> res.result)
    )
  }
  public exportAsExcel(searchQuery: string) {
    return this._http.post(`${this.BILLING_CYCLE_Endpoint}/ExportAsExcel`,{ searchQuery }, { observe: 'response', responseType: 'blob' })
  }

  public getBillingCycleDetails(pagination: PaginationConfigModel, filtration:BILLING_CYCLES.BillingCycleDetailsFiltrationModel): Observable<PaginationModel<BILLING_CYCLES.BillingCycleDetailsModel>>{
    return this._http.post(`${this.BILLING_CYCLE_Endpoint}/GetBillingCycleDetails${buildQueryString({...pagination})}`,filtration).pipe(
      map((res: ApiResponse<PaginationModel<BILLING_CYCLES.BillingCycleDetailsModel>>)=> res.result)
    )
  }

  public exportBillingCycleDetailsAsExcel(filtration:BILLING_CYCLES.BillingCycleDetailsFiltrationModel) {
    return this._http.post(`${this.BILLING_CYCLE_Endpoint}/ExportBillingCycleDetailsAsExcel`, filtration , { observe: 'response', responseType: 'blob' })
  }

  public getById(billingCycleId: string): Observable<BILLING_CYCLES.BillingCycleModel>{
    return this._http.fetch(`${this.BILLING_CYCLE_Endpoint}/GetById${buildQueryString({billingCycleId})}`).pipe(
      map((res:ApiResponse<BILLING_CYCLES.BillingCycleModel>)=> res.result)
    )
  }
  public AddDiscountForResource(
    payload: BILLING_CYCLES.DiscountModel
  ): Observable<boolean> {
    return this._http.post(
      `${this.BILLING_CYCLE_Endpoint}/AddDiscountForResource`,
      payload
    );
  }
  public DeleteDiscountForResource(assignedProfileId: string): Observable<any> {
    return this._http.post(
      `${
        this.BILLING_CYCLE_Endpoint
      }/DeleteDiscountForResource${buildQueryString({ assignedProfileId: assignedProfileId })}`
    );
  }
  public UpdateDiscountForResource(
    payload: BILLING_CYCLES.DiscountModel
  ): Observable<boolean> {
    return this._http.post(
      `${this.BILLING_CYCLE_Endpoint}/UpdateDiscountForResource`,
      payload
    );
  }
}
