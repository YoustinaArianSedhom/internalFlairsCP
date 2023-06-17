import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import * as BILLING_CYCLES_MODELS from '@modules/billing-cycles/models/billing-cycles.models';

export class GetFilteredPage {
   static readonly type = '[Billing Cycle] Get Filtered Page';
}

export class SearchFilteredPage {
   static readonly type = '[Billing Cycle] Search Filtered Page';
   constructor( public cyclesSearchQuery: string) { }
}


export class PaginateFilteredPage {
   static readonly type = '[Billing Cycle] Paginate Filtered Page';
   constructor(public cyclesPagination: PaginationConfigModel) {}
}
export class ResetFiltrationFilteredPage {
   static readonly type = '[Billing Cycle] Reset Filtration Filtered Page';

}

export class ExportAsExcel {
   static readonly type = '[Billing Cycle] Export As Excel';
}


export class SetBillingCycleId {
   static readonly type = '[Billing Cycle] Set Billing Cycle ID';
   constructor(public billingCycleId: string){}
}

export class GetBillingCycleById {
   static readonly type = '[Billing Cycle] Get Billing Cycle By ID';
   
}

export class GetBillingCycleDetails{
   static readonly type = '[Billing Cycle] Get Billing Cycle Details';
}

export class PaginateBillingCycleDetails{
   static readonly type = '[Billing Cycle] Paginate Billing Cycle Details';
   constructor(public poPagination: PaginationConfigModel) {}

}

export class SearchBillingCycleDetails{
   static readonly type = '[Billing Cycle] Search Billing Cycle Details';
   constructor(public poSearchQuery: string ) {}
}

export class ExportBillingCycleDetailsAsExcel {
   static readonly type = '[Billing Cycle] Export Billing Cycle Details As Excel';
}
export class ToggleShowAmount {
   static readonly type = '[Billing Cycle] Toggle Show Amount';
}

export class ToggleShowBillingRateAndAmount {
   static readonly type = '[Billing Cycle] Toggle Show Billing Rate & Amount';
}
export class AddDiscountForResource {
   static readonly type = '[Billing Cycle]  Add Discount For Resource';
   constructor(public payload: BILLING_CYCLES_MODELS.DiscountModel ) {
   }
 }
 export class DeleteDiscountForResource {
   static readonly type = '[ Billing Cycle] Delete Discount For Resource';
   constructor(public assignedProfileId: string) {
   }
 }
 export class UpdateDiscountForResource {
   static readonly type = '[Monthly Billing Cycle] Update Discount For Resource';
   constructor(public payload: BILLING_CYCLES_MODELS.DiscountModel ) {
   }
 }