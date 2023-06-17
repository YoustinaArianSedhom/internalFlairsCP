import { Injectable } from "@angular/core";
import {
  CanLoad,
  Route,
  UrlSegment,
  Router,
  CanActivate,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from "@angular/router";
import { Observable } from "rxjs";
import { SSAConfigInst } from 'src/app/config/app.config';
import { Store } from "@ngxs/store";
import { AuthorizationState } from "../state/authorization.state";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class EmployeeGuard implements CanActivate, CanLoad {
  constructor(
    private _store: Store,
    private _router: Router) { }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this._handleProtection();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._handleProtection();
  }



  private _handleProtection(): Observable<boolean> {
    return this._store.select(AuthorizationState.isEmployee).pipe(
      map(isManager => {
        if (isManager) return true;
        this._router.navigate([SSAConfigInst.ROUTES_CONFIG.forbidden]);
        return false;
      })
    )
  }

}
