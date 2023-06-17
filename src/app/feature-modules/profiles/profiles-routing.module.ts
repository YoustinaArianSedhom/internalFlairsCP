import { ProfilesComponent } from './pages/profiles/profiles.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileDetailsComponent } from './pages/profile-details/profile-details.component';

const routes: Routes = [
  { path: '', component: ProfilesComponent },
  { path: 'details/:profileId', component: ProfileDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilesRoutingModule {}
