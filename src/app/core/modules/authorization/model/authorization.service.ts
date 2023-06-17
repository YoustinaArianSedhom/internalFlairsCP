import { Injectable } from '@angular/core';
import { PermissionModel, PermissionsListModel, SystemRolesModel } from './authorization.model';
import { HttpService } from '@core/http/http/http.service';
import { map } from 'rxjs/operators';
import { ApiResponse } from '@core/http/apis.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  constructor(
    private _http: HttpService
  ) { }




  private _initialPermissions: PermissionsListModel = {
    Test: {
      name: 'rule_test',
      route: 'rule_route',
      action: {},
      roles: []
    }
  };



  /**
   *  Set the available permissions to logged-in user  based on its own roles
   */
  public setUserPermissions(permissions: PermissionModel[], roles: string[] = []): PermissionsListModel {
    let loggedInUserPermissions: PermissionsListModel = {...this._initialPermissions};

    if (roles) {
      permissions.forEach((permission: PermissionModel, index: number) => {
        roles.forEach(role => {
          if (permission.roles.includes(role)) loggedInUserPermissions[permission.name] = permissions[index];
        });
      });
    }

    return loggedInUserPermissions;
  }


  public loadSystemRoles(): Observable<string[]> {
    return this._http.fetch('Auth/GetSystemPermissions').pipe(
      map((res: ApiResponse<string[]>) => res.result)
    )
  }


}
