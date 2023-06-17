import { Injectable } from "@angular/core";
import { CanLoad, Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from '@core/auth/model/auth.service';
import { SSAConfigInst } from "src/app/config/app.config";
import { Store } from "@ngxs/store";
import { AuthorizationState } from "../state/authorization.state";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class ManagerGuard implements CanActivate, CanLoad {
  constructor(
    private _router: Router,
    private _auth: AuthService,
    private _store: Store) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    return this._handleProtection();
  }


  canLoad(): Observable<boolean> | Promise<boolean> | boolean {
    return this._handleProtection()
  }


  /**
   * 
   * @returns Observable of boolean
   */
  private _handleProtection(): Observable<boolean> {
    return this._store.select(AuthorizationState.isManager).pipe(
      map(isManager => {
        if (isManager) return true;
        this._router.navigate([SSAConfigInst.ROUTES_CONFIG.root]);
        return false;
      })
    )
  }
}
