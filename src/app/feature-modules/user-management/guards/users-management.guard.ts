import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthorizationState } from '@core/modules/authorization/state/authorization.state';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SSAConfigInst } from 'src/app/config/app.config';

@Injectable({
  providedIn: 'root'
})
export class UsersManagementGuard implements CanActivate {
  constructor(private _store: Store, private _router: Router) {

  }


  /**
   * 
   * @description Check if the logged in user has the permissionManagement Role 
   * and if true it's gonna pass the user to the page
   * and if false it's gonna redirect the user to the home page
   * @param route 
   * @param state 
   * @returns {Observable<boolean>}
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this._store.select(AuthorizationState.isPermissionManagement).pipe(
        map((isPermissionManagement) => {
          if (isPermissionManagement) return true;
          this._router.navigate([SSAConfigInst.ROUTES_CONFIG.forbidden]);
          return false;
        })
      )
  }
  
}
