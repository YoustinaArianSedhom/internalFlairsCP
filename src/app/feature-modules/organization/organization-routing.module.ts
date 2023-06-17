import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentsComponent } from './pages/departments/departments.component';
import { MyClientsComponent } from './pages/my-clients/my-clients.component';
import { MyPortfoliosComponent } from './pages/my-portfolios/my-portfolios.component';
import { MyTeamsComponent } from './pages/my-teams/my-teams.component';
import { TeamsProfilesComponent } from './pages/teams-profiles/teams-profiles.component';

const routes: Routes = [
  { path: '', component: MyClientsComponent },
  { path: 'portfolios/:clientdID', component: MyPortfoliosComponent },
  { path: 'teams/:portfolioID', component: MyTeamsComponent },
  { path: 'departments/:departmentID', component: DepartmentsComponent },
  { path: 'profiles/:teamID/:departmentID', component: TeamsProfilesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizationRoutingModule {}
