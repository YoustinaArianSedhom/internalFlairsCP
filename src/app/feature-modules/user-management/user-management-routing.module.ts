import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersManagementGuard } from './guards/users-management.guard';
import { ManageUsersComponent } from './pages/manage-users/manage-users.component';

const routes: Routes = [{ path: '', component: ManageUsersComponent, canActivate: [UsersManagementGuard]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }
