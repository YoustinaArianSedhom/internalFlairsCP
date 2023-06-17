import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageMonthlyBillingCyclePageComponent } from './pages/manage-monthly-billing-cycle-page/manage-monthly-billing-cycle-page.component';
import { ManageMonthlyBillingCyclesDetailsPageComponent } from './pages/manage-monthly-billing-cycles-details-page/manage-monthly-billing-cycles-details-page.component';
import { ManageViewUnassociatedSubsPageComponent } from './pages/manage-view-unassociated-subs-page/manage-view-unassociated-subs-page.component';

const routes: Routes = [
  {
    path: '',
    component: ManageMonthlyBillingCyclePageComponent
  },
  {
    path: 'monthly-cycle-details/:month/:year',
    component: ManageMonthlyBillingCyclesDetailsPageComponent
  },
  {
    path: 'view-unassociated-subs/:month/:year',
    component: ManageViewUnassociatedSubsPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonthlyBillingCycleRoutingModule { }
