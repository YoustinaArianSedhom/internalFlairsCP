import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketsRoutingModule } from './tickets-routing.module';
import { TicketsComponent } from './pages/tickets/tickets.component';
import { TableMyTicketsComponent } from './components/table-my-tickets/table-my-tickets/table-my-tickets.component';
import { ModalMyTeamsComponent } from '@modules/my-accounts/components/modal-my-teams/modal-my-teams.component';
import { SharedModule } from '@shared/shared.module';
import { NgxsModule } from '@ngxs/store';
import { MyTicketsState } from './state/my-tickets.state';
import { ModalMyTicketsComponent } from './components/modal-my-tickets/modal-my-tickets.component';
import { TicketsInternalComponent } from './pages/tickets-internal/tickets-internal.component';
import { TableInternalMyTicketsComponent } from './components/table-internal-my-tickets/table-internal-my-tickets.component';
import { TicketsWrapperComponent } from './pages/tickets-wrapper/tickets-wrapper.component';
import { TicketsDetailsComponent } from './components/tickets-details/tickets-details.component';

@NgModule({
  declarations: [
    TicketsComponent,
    TableMyTicketsComponent,
    ModalMyTicketsComponent,
    TicketsInternalComponent,
    TableInternalMyTicketsComponent,
    TicketsWrapperComponent,
    TicketsDetailsComponent,
  ],
  imports: [
    CommonModule,
    TicketsRoutingModule,
    SharedModule,
    NgxsModule.forFeature([MyTicketsState]),
  ],
})
export class TicketsModule {}
