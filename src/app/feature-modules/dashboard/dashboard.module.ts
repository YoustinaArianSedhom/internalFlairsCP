import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { dashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '@shared/shared.module';
import { NgxsModule } from '@ngxs/store';
import { OrganizationState } from '@modules/organization/state/organization.state';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    dashboardRoutingModule,
    SharedModule,
    NgxsModule.forFeature([OrganizationState]),
  ],
})
export class DashboardModule {}
