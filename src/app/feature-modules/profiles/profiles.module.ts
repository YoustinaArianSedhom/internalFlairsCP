import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfilesRoutingModule } from './profiles-routing.module';
import { ProfilesComponent } from './pages/profiles/profiles.component';
import { TableProfilesComponent } from './components/table-profiles/table-profiles/table-profiles.component';
import { ModalProfilesComponent } from './components/modal-profiles/modal-profiles.component';
import { SharedModule } from '@shared/shared.module';
import { NgxsModule } from '@ngxs/store';
import { ProfileState } from './state/profiles.state';
import { ProfileDetailsComponent } from './pages/profile-details/profile-details.component';
import { ModalEditClientRolesComponent } from './components/modal-edit-profile-roles/modal-edit-profile-roles.component';
import { SkillsAutoCompleteComponent } from './components/skills-auto-complete/skills-auto-complete.component';

@NgModule({
  declarations: [
    ProfilesComponent,
    TableProfilesComponent,
    ModalProfilesComponent,
    ProfileDetailsComponent,
    ModalEditClientRolesComponent,
    SkillsAutoCompleteComponent,
  ],
  imports: [
    CommonModule,
    ProfilesRoutingModule,
    SharedModule,
    NgxsModule.forFeature([ProfileState]),
  ],
})
export class ProfilesModule {}
