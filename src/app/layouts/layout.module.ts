import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorizedLayoutComponent } from './pages/authorized-layout/authorized-layout.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { GuestLayoutComponent } from './pages/guest-layout/guest-layout.component';
import { NavItemComponent } from './components/nav-item/nav-item.component';
import { MaterialModule } from '@shared/material.module';
import { ThemeControlComponent } from './components/theme-control/theme-control.component';
import { UserNavComponent } from './components/user-nav/user-nav.component';
import { ClickOutsideModule } from 'ng-click-outside';



@NgModule({
  declarations: [
    AuthorizedLayoutComponent,
    GuestLayoutComponent,
    SideNavComponent,
    NavItemComponent,
    ThemeControlComponent,
    UserNavComponent,
    
  ],
  imports: [
    CommonModule,
    MatSidenavModule,
    RouterModule,
    MaterialModule,
    ClickOutsideModule
  ]
})
export class LayoutModule {}
