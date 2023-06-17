import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageMyTeamPageComponent } from './pages/manage-my-team-page/manage-my-team-page.component';

const routes: Routes = [
  {
    path: '',
    component: ManageMyTeamPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyTeamRoutingModule { }
