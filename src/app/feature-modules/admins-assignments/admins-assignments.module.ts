import { AdminsAssignmentsState } from './state/admins-assignments.state';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminsAssignmentsRoutingModule } from './admins-assignments-routing.module';
import { TableAdminsAssignmentsComponent } from './components/table-admins-assignments/table-admins-assignments.component';
import { ManageAdminsAssignmentsPageComponent } from './pages/manage-admins-assignments-page/manage-admins-assignments-page.component';
import { SharedModule } from '@shared/shared.module';
import { NgxsModule } from '@ngxs/store';
import { AddEditAssignmentsModalComponent } from './components/add-edit-assignments-modal/add-edit-assignments-modal.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    TableAdminsAssignmentsComponent,
    ManageAdminsAssignmentsPageComponent,
    AddEditAssignmentsModalComponent
  ],
  imports: [
    CommonModule,
    AdminsAssignmentsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgxsModule.forFeature([AdminsAssignmentsState])
  ]
})
export class AdminsAssignmentsModule { }
