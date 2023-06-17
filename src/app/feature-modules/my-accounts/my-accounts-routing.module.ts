import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyTeamsComponent } from './pages/my-teams/my-teams.component';

const routes: Routes = [{ path: '', component: MyTeamsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyTeamsRoutingModule {}
