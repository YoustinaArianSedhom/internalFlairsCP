import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperAdminGuard } from '@core/modules/authorization/guards/Admin.guard';
import { AuthorizationState } from '@core/modules/authorization/state/authorization.state';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { TicketsComponent } from './pages/tickets/tickets.component';
import { InternalAdminGuard } from './../../core/modules/authorization/guards/InternalAdmin.guard';
import { TicketsInternalComponent } from './pages/tickets-internal/tickets-internal.component';
import { TicketsWrapperComponent } from './pages/tickets-wrapper/tickets-wrapper.component';

const routes: Routes = [{ path: '', component: TicketsWrapperComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketsRoutingModule {
  @Select(AuthorizationState.isInternalAdmin)
  public isInternalAdmin$: Observable<boolean>;
}
