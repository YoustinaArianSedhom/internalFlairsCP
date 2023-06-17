import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageBillingCycleDetailsComponent } from './pages/manage-billing-cycle-details/manage-billing-cycle-details.component';
import { ManageBillingCyclesPageComponent } from './pages/manage-billing-cycles-page/manage-billing-cycles-page.component';

const routes: Routes = [
  {
    path: '',
    component: ManageBillingCyclesPageComponent
  },
  {
    path: 'cycle-details/:id',
    component: ManageBillingCycleDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillingCyclesRoutingModule { }
