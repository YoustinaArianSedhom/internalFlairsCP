import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyTeamsRoutingModule } from './my-accounts-routing.module';
import { MyTeamsComponent } from './pages/my-teams/my-teams.component';
import { SharedModule } from '@shared/shared.module';
import { TableMyTeamsComponent } from './components/table-my-teams/table-my-teams/table-my-teams.component';
import { NgxsModule } from '@ngxs/store';
import { MyTeamsState } from './state/my-accounts.state';
import { ModalMyTeamsComponent } from './components/modal-my-teams/modal-my-teams.component';
import { SkillsAutoCompleteComponent } from './components/skills-auto-complete/skills-auto-complete.component';
import { ProfileState } from '@modules/profiles/state/profiles.state';

@NgModule({
  declarations: [
    MyTeamsComponent,
    TableMyTeamsComponent,
    ModalMyTeamsComponent,
    SkillsAutoCompleteComponent,
  ],
  imports: [
    CommonModule,
    MyTeamsRoutingModule,
    SharedModule,
    NgxsModule.forFeature([MyTeamsState, ProfileState]),
  ],
})
export class MyAccountsModule {}
