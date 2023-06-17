import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '@core/auth/pages/login/login.component';
import { AutoLoginComponent } from './pages/autologin/autologin.component';
import { LogoutComponent } from './pages/logout/logout.component';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },

  {
    path: "login",
    component: AutoLoginComponent,
  },
  {
    path: 'logout',
    component: LogoutComponent
  }, {
    path: 'auto-login',
    component: AutoLoginComponent
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
