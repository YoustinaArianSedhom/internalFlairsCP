import { NgModule } from '@angular/core';

import { UserManagementRoutingModule } from './user-management-routing.module';
import { ManageUsersComponent } from './pages/manage-users/manage-users.component';
import { TableUserManagementComponent } from './components/table-user-management/table-user-management.component';
import { UserRolesFormComponent } from './components/user-roles-form/user-roles-form.component';
import { UserManagementService } from './model/user-management.service';
import { SharedModule } from '@shared/shared.module';
import { NgxsModule } from '@ngxs/store';
import { UserManagementState } from './state/user-management.state';
import { UsersManagementGuard } from './guards/users-management.guard';
import { CardUserManagementComponent } from './components/card-user-management/card-user-management.component';
import { CardWrapperUserManagementComponent } from './components/cards-wrapper-user-management/cards-wrapper-user-management.component';


@NgModule({
  declarations: [ManageUsersComponent, TableUserManagementComponent, UserRolesFormComponent, CardUserManagementComponent, CardWrapperUserManagementComponent],
  imports: [
    UserManagementRoutingModule,
    SharedModule,
    NgxsModule.forFeature([UserManagementState])
  ],
  providers: [UserManagementService, UsersManagementGuard]
})
export class UserManagementModule { }
