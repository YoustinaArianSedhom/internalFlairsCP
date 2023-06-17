import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/auth/auth.guard';
import { SomethingWentWrongComponent } from '@core/components/something-went-wrong/something-went-wrong.component';
import { ForbiddenComponent } from '@core/modules/authorization/forbidden/forbidden.component';
import { AuthorizedLayoutComponent } from './layouts/pages/authorized-layout/authorized-layout.component';
import { GuestLayoutComponent } from './layouts/pages/guest-layout/guest-layout.component';
import { SuperAdminGuard } from './core/modules/authorization/guards/Admin.guard';
import { InternalAdminGuard } from '@core/modules/authorization/guards/InternalAdmin.guard';
const routes: Routes = [
  {
    path: '',
    component: AuthorizedLayoutComponent,
    // canLoad: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        canLoad: [AuthGuard],
        loadChildren: () =>
          import('@modules/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'my-accounts/:clientId',
        canLoad: [AuthGuard],
        loadChildren: () =>
          import('./feature-modules/my-accounts/my-accounts.module').then(
            (m) => m.MyAccountsModule
          ),
      },
      {
        path: 'organization',
        canLoad: [AuthGuard],
        loadChildren: () =>
          import('./feature-modules/organization/organization.module').then(
            (m) => m.OrganizationModule
          ),
      },

      {
        path: 'my-tickets/:ticketsClientId',
        canLoad: [AuthGuard],
        loadChildren: () =>
          import('./feature-modules/tickets/tickets.module').then(
            (m) => m.TicketsModule
          ),
      },

      {
        path: 'my-tickets',
        canLoad: [AuthGuard],
        loadChildren: () =>
          import('./feature-modules/tickets/tickets.module').then(
            (m) => m.TicketsModule
          ),
      },

      {
        path: 'clients-management',
        canLoad: [AuthGuard],
        loadChildren: () =>
          import(
            './feature-modules/clients-management/clients-management.module'
          ).then((m) => m.ClientsManagementModule),
      },
      {
        path: 'admins-assignments',
        canActivate: [SuperAdminGuard],
        loadChildren: () => import('./feature-modules/admins-assignments/admins-assignments.module').then((m) => m.AdminsAssignmentsModule)
      },

      {
        path: 'profiles',
        canLoad: [AuthGuard],
        loadChildren: () =>
          import('./feature-modules/profiles/profiles.module').then(
            (m) => m.ProfilesModule
          ),
      },
      {
        path: 'assigned-profiles',
        canLoad: [AuthGuard],
        loadChildren: () =>
          import(
            './feature-modules/assigned-profiles/assigned-profiles.module'
          ).then((m) => m.AssignedProfilesModule),
      },
      {
        path:'billing',
        canLoad: [InternalAdminGuard],
        loadChildren:()=> import('./feature-modules/billing-cycles/billing-cycles.module').then((m)=> m.BillingCyclesModule),
      },
      {
        path: 'monthly-billing-cycle',
        canLoad: [InternalAdminGuard],
        loadChildren: ()=> import('./feature-modules/monthly-billing-cycle/monthly-billing-cycle.module').then(m=> m.MonthlyBillingCycleModule)
      },
      {
        path: 'my-team',
        canLoad: [InternalAdminGuard],
        loadChildren: ()=> import('./feature-modules/my-team/my-team.module').then(m=> m.MyTeamModule)
      },
      {
        path: 'po',
        canLoad: [AuthGuard],
        loadChildren: () =>
          import(
            './feature-modules/po/po.module'
          ).then((m) => m.POModule),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },

  // not authorized routes
  {
    path: 'guest',
    component: GuestLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@core/auth/auth.module').then((m) => m.AuthModule),
      },
    ],
  },

  // Exception routes
  {
    path: 'unexpected',
    component: GuestLayoutComponent,
    children: [
      {
        path: 'forbidden',
        component: ForbiddenComponent,
      },
      {
        path: 'not-found',
        component: SomethingWentWrongComponent,
      },
    ],
  },

  {
    path: '**',
    redirectTo: 'unexpected/not-found',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
