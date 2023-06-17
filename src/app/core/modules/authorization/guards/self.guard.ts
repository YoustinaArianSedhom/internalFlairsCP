import { Injectable, OnChanges, OnInit } from '@angular/core';
import { CanActivate, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '@core/auth/model/auth.service';
import { Select } from '@ngxs/store';
import { UserState } from '@core/modules/user/state/user.state';
import { UserModel } from '@core/modules/user/model/user.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SelfGuard implements CanActivate, CanLoad {

  constructor(
    private _auth: AuthService,
    private _router: Router
  ) { }

  @Select(UserState.user) public user$: Observable<UserModel>;




  /**
   * 
   * @todo Move all the redirection login that happens into profiles page and profile page into here
   * 
   * @note think about it carefully before implement it
   * check if the targeted profile id equal to logged in user id 
   * and based on result, navigate it to my profile of continue to the targeted route 
   */
  private _checkIfIsTheLoggedInUser(next: ActivatedRouteSnapshot) {
    return this.user$.pipe(map(user => {
      if ((this._auth.isManager || this._auth.isAdmin) && (next.params.id != user.profileId)) return true;
      this._navigateToMyProfile();
      return false;
    }));
  }

  private _navigateToMyProfile() {
    this._router.navigate(["/employees/profile/view"]);
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this._checkIfIsTheLoggedInUser(next);
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    if (this._auth.isManager || this._auth.isAdmin) return true;
    this._router.navigate(["/"]);
  }
}
