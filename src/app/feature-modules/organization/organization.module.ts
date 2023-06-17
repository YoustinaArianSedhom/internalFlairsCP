import { MatTableModule } from '@angular/material/table';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganizationRoutingModule } from './organization-routing.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { SharedModule } from '@shared/shared.module';
import { ModalAddClientComponent } from './components/modal-add-client/modal-add-client.component';
import { AlifeFileToBase64Module } from 'alife-file-to-base64';
import { MatMenuModule } from '@angular/material/menu';
import { ModalAddTeamComponent } from './components/modal-add-team/modal-add-team.component';
import { ModalDeleteTeamComponent } from './components/modal-delete-team/modal-delete-team.component';
import { ModalMemberTeamComponent } from './components/modal-member-team/modal-member-team.component';
import { ModalAddPortfolioComponent } from './components/modal-add-portfolio/modal-add-portfolio.component';
import { ModalDeleteClientComponent } from './components/modal-delete-client/modal-delete-client.component';
import { NgxsModule } from '@ngxs/store';
import { OrganizationState } from './state/organization.state';
import { ModalEditClientComponent } from './components/modal-edit-client/modal-edit-client.component';
import { ModalEditPortfolioComponent } from './components/modal-edit-portfolio/modal-edit-portfolio.component';
import { ModalDeletePortfolioComponent } from './components/modal-delete-portfolio/modal-delete-portfolio.component';
import { TableClientsComponent } from './components/table-clients/table-clients/table-clients.component';
import { TablePortfoliosComponent } from './components/table-portfolios/table-portfolios/table-portfolios.component';
import { TableTeamsComponent } from './components/table-teams/table-teams/table-teams.component';
import { TableProfilesComponent } from './components/table-profiles/table-profiles.component';
import { ModalCreateAdminComponent } from './components/modal-create-admin/modal-create-admin.component';
import { ModalViewClientAdminComponent } from './components/modal-view-client-admin/modal-view-client-admin.component';
import { ClientsTreeComponent } from './components/clients-tree/clients-tree.component';
import {  MatTreeModule } from '@angular/material/tree';
import { ModalEditAdminComponent } from './components/modal-edit-admin/modal-edit-admin.component';
import { MyClientsComponent } from './pages/my-clients/my-clients.component';
import { MyPortfoliosComponent } from './pages/my-portfolios/my-portfolios.component';
import { MyTeamsComponent } from './pages/my-teams/my-teams.component';
import { TeamsProfilesComponent } from './pages/teams-profiles/teams-profiles.component';
import { DepartmentsComponent } from './pages/departments/departments.component';
import { TableDepartmentsComponent } from './components/table-departments/table-departments.component';

@NgModule({
  declarations: [
    ModalAddClientComponent,
    ModalAddTeamComponent,
    ModalDeleteTeamComponent,
    ModalMemberTeamComponent,
    ModalAddPortfolioComponent,
    ModalDeleteClientComponent,
    ModalEditClientComponent,
    ModalEditPortfolioComponent,
    ModalDeletePortfolioComponent,
    TableClientsComponent,
    TablePortfoliosComponent,
    TableTeamsComponent,
    TableProfilesComponent,
    ModalCreateAdminComponent,
    ModalEditAdminComponent,
    ModalViewClientAdminComponent,
    ClientsTreeComponent,
    MyClientsComponent,
    MyPortfoliosComponent,
    MyTeamsComponent,
    TeamsProfilesComponent,
    DepartmentsComponent,
    TableDepartmentsComponent,
  ],
  imports: [
    CommonModule,
    OrganizationRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    AlifeFileToBase64Module,
    MatExpansionModule,
    MatMenuModule,
    SharedModule,
    MatTreeModule,
    NgxsModule.forFeature([OrganizationState]),
  ],
  exports: [ClientsTreeComponent],
})
export class OrganizationModule {}
