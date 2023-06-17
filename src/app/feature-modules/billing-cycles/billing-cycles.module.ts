import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

import { BillingCyclesRoutingModule } from './billing-cycles-routing.module';
import { ManageBillingCyclesPageComponent } from './pages/manage-billing-cycles-page/manage-billing-cycles-page.component';
import { SharedModule } from '@shared/shared.module';
import { NgxsModule } from '@ngxs/store';
import { BillingCyclesState } from './state/billing-cycles.state';
import { TableBillingCyclesComponent } from './components/table-billing-cycles/table-billing-cycles.component';
import { ManageBillingCycleDetailsComponent } from './pages/manage-billing-cycle-details/manage-billing-cycle-details.component';
import { TableBillingCycleDetailsComponent } from './components/table-billing-cycle-details/table-billing-cycle-details.component';
import { ModalAddEditDiscountComponent } from './components/modal-add-edit-discount/modal-add-edit-discount.component';
@NgModule({
  declarations: [
    ManageBillingCyclesPageComponent,
    TableBillingCyclesComponent,
    ManageBillingCycleDetailsComponent,
    TableBillingCycleDetailsComponent,
    ModalAddEditDiscountComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    BillingCyclesRoutingModule,
    NgxsModule.forFeature([BillingCyclesState])

  ],
  providers: [CurrencyPipe]
})
export class BillingCyclesModule { }
