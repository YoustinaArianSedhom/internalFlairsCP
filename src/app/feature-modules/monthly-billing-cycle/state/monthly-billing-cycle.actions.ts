import { PaginationConfigModel } from "@shared/modules/pagination/model/pagination.model";
 import * as MONTHLY_BILLING_CYCLES_MODELS from './../models/monthly-billing-cycle.models'

export class GetMonthlyBillingCycles {
   static readonly type = '[Monthly Billing Cycle] Get Monthly Billing Cycles';
}

export class PaginateMonthlyBillingCycles {
   static readonly type = '[Monthly Billing Cycle] Paginate Monthly Billing Cycles';
   constructor(public monthlyBillingPagination: PaginationConfigModel) { }
}
export class ExportMonthlyBillingCyclesAsExcel {
   static readonly type = '[Monthly Billing Cycle] Export Monthly Billing Cycles As Excel';
}

/* __________________________________Monthly Billing CycleDetails Actions __________________________________*/
export class GetMonthlyBillingCyclesDetails {
   static readonly type = '[Monthly Billing Cycle] Get Monthly Billing Cycles Details';
}

export class PaginateMonthlyBillingCyclesDetails {
   static readonly type = '[Monthly Billing Cycle] Paginate Monthly Billing Cycles Details';
   constructor(public monthlyBillingCyclesDetailsPagination: PaginationConfigModel) { }
}

export class FilterMonthlyBillingCyclesDetails {
   static readonly type = '[Monthly Billing Cycle] Filter Monthly Billing Cycles Details';
   constructor(public filtration: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleDetailsFiltrationModel) {}
}
export class ExportMonthlyBillingCyclesDetailsAsExcel {
   static readonly type = '[Monthly Billing Cycle] Export Monthly Billing Cycles Details As Excel';
}

/* __________________________________ Unassosiated Subordinates Actions __________________________________*/
export class GetUnassociatedSubsCount {
   static readonly type = '[Monthly Billing Cycle] Get Unassociated Subs Count';
   constructor(public filtration: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleDetailsFiltrationModel) {}
}

export class GetUnassociatedSubs {
   static readonly type = '[Monthly Billing Cycle] Get Unassociated Subs';
}


export class PaginateUnassociatedSubs {
   static readonly type = '[Monthly Billing Cycle] paginate Unassociated Subs';
   constructor(public unassociatedSubsPagination: PaginationConfigModel){ }
}

export class FilterUnassociatedSubs {
   static readonly type = '[Monthly Billing Cycle] Filter Unassociated Subs';
   constructor(public unassociatedSubsFiltration: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleDetailsFiltrationModel) { }
}
export class ToggleShowAmount {
   static readonly type = '[Monthly Billing Cycle] Toggle Show Amount';
}
export class AddDiscountForResource {
   static readonly type = '[Monthly Billing Cycle] Add Discount For Resource';
   constructor(public payload: MONTHLY_BILLING_CYCLES_MODELS.DiscountModel ) {
   }
 }

 export class DeleteDiscountForResource {
   static readonly type = '[Monthly Billing Cycle] Delete Discount For Resource';
   constructor(public assignedProfileId: string) {
   }
 }
 export class UpdateDiscountForResource {
   static readonly type = '[Monthly Billing Cycle] Update Discount For Resource';
   constructor(public payload: MONTHLY_BILLING_CYCLES_MODELS.DiscountModel ) {
   }
 }
