import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { SSAConfigInst } from 'src/app/config/app.config';
import { StorageService } from '@core/services/storage/storage.service';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './model/auth.service';
import { SetReturnUrl } from './state/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _storage: StorageService,
    private _location: Location) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this._routeProtectionChecker(state.url)
  }


  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this._routeProtectionChecker()
  }

  private _routeProtectionChecker(route?: string): Observable<boolean> {
    return this._authService.canActivateProtectedRoutes$.pipe(
      tap(isAuthorized => {
        if (!isAuthorized) {
          const returnUrl = route ?? this._location.path(); 
          this._fireSetReturnUrl(returnUrl);
          console.info("[Auth Guard] Current User don't have access token, He will be redirected to login page");
          this._router.navigate([SSAConfigInst.ROUTES_CONFIG.login])
        }
      })
    );
  }


  @Dispatch() private _fireSetReturnUrl(returnUrl: string) { return new SetReturnUrl(returnUrl)}
}
