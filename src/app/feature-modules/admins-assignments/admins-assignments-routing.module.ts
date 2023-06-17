import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageAdminsAssignmentsPageComponent } from './pages/manage-admins-assignments-page/manage-admins-assignments-page.component';

const routes: Routes = [
  {
    path: '',
    component: ManageAdminsAssignmentsPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminsAssignmentsRoutingModule { }
