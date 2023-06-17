import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyTeamRoutingModule } from './my-team-routing.module';
import { SharedModule } from '@shared/shared.module';
import { TableMyTeamComponent } from './components/table-my-team/table-my-team.component';
import { NgxsModule } from '@ngxs/store';
import { MyTeamState } from './state/my-team.state';
import { ManageMyTeamPageComponent } from './pages/manage-my-team-page/manage-my-team-page.component';
import { ManagersAutoCompleteComponent } from './components/managers-auto-complete/managers-auto-complete.component';


@NgModule({
  declarations: [
    TableMyTeamComponent,
    ManageMyTeamPageComponent,
    ManagersAutoCompleteComponent,
    
  ],
  imports: [
    CommonModule,
    MyTeamRoutingModule,
    SharedModule,
    NgxsModule.forFeature([MyTeamState])
  ],
})
export class MyTeamModule { }
