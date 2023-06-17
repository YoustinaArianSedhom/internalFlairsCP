import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientsManagementRoutingModule } from './clients-management-routing.module';
import { ExternalComponent } from './pages/external/external.component';
import { InternalComponent } from './pages/internal/internal.component';
import { TableClientsManagementComponent } from './components/table-clients-management/table-clients-management.component';
import { ClientsManagementState } from './state/clients-managements.state';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { NgxsModule } from '@ngxs/store';
import { SharedModule } from '@shared/shared.module';
import { AlifeFileToBase64Module } from 'alife-file-to-base64';
import { OrganizationState } from '@modules/organization/state/organization.state';
import { TableInternalClientsManagementComponent } from './components/table-internal-clients-management/table-internal-clients-management.component';
import { ModalEditInternalRolesComponent } from './components/modal-edit-internal-roles/modal-edit-internal-roles.component';
import { OrganizationModule } from '@modules/organization/organization.module';

@NgModule({
  declarations: [
    ExternalComponent,
    InternalComponent,
    TableClientsManagementComponent,
    TableInternalClientsManagementComponent,
    ModalEditInternalRolesComponent,
  ],
  imports: [
    CommonModule,
    ClientsManagementRoutingModule,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    AlifeFileToBase64Module,
    MatExpansionModule,
    MatMenuModule,
    SharedModule,
    OrganizationModule,
    NgxsModule.forFeature([ClientsManagementState, OrganizationState]),
  ],
})
export class ClientsManagementModule {}
