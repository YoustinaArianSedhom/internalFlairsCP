import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MonthlyBillingCycleRoutingModule } from './monthly-billing-cycle-routing.module';
import { ManageMonthlyBillingCyclePageComponent } from './pages/manage-monthly-billing-cycle-page/manage-monthly-billing-cycle-page.component';
import { SharedModule } from '@shared/shared.module';
import { NgxsModule } from '@ngxs/store';
import { MonthlyBillingCyclesState } from './state/monthly-billing-cycle.state';
import { TableMonthlyBillingCyclesComponent } from './components/table-monthly-billing-cycle/table-monthly-billing-cycles.component';
import { ManageMonthlyBillingCyclesDetailsPageComponent } from './pages/manage-monthly-billing-cycles-details-page/manage-monthly-billing-cycles-details-page.component';
import { MonthPoDetailsComponent } from './components/month-po-details/month-po-details.component';
import { MonthlyBillingMonthViewAmountComponent } from './components/monthly-billing-month-view-amount/monthly-billing-month-view-amount.component';
import { TableMonthlyBillingCyclesDetailsComponent } from './components/table-monthly-billing-cycles-details/table-monthly-billing-cycles-details.component';
import { ManageViewUnassociatedSubsPageComponent } from './pages/manage-view-unassociated-subs-page/manage-view-unassociated-subs-page.component';
import { TableUnassociatedSubsComponent } from './components/table-unassociated-subs/table-unassociated-subs.component';
import { ModalAddEditDiscountComponent } from './components/modal-monthly-add-edit-discount/modal-monthly-add-edit-discount.component';
@NgModule({
  declarations: [
    ManageMonthlyBillingCyclePageComponent,
    ManageMonthlyBillingCyclesDetailsPageComponent,
    TableMonthlyBillingCyclesComponent,
    MonthPoDetailsComponent,
    MonthlyBillingMonthViewAmountComponent,
    TableMonthlyBillingCyclesDetailsComponent,
    ManageViewUnassociatedSubsPageComponent,
    TableUnassociatedSubsComponent,
    ModalAddEditDiscountComponent
  ],
  imports: [
    CommonModule,
    MonthlyBillingCycleRoutingModule,
    SharedModule,
    NgxsModule.forFeature([MonthlyBillingCyclesState])
  ],
  providers: [CurrencyPipe]
})
export class MonthlyBillingCycleModule { }
