import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { LoadSystemRoles } from '@core/modules/authorization/state/authorization.actions';
import { AuthorizationState } from '@core/modules/authorization/state/authorization.state';
import * as USER_MANAGEMENT_MODELS from '@modules/user-management/model/user-management.models';
import * as USER_MANAGEMENT_ACTIONS from '@modules/user-management/state/user-management.actions';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Store } from '@ngxs/store';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { SSAConfigInst } from 'src/app/config/app.config';

@Component({
  selector: 'ssa-user-roles-form',
  templateUrl: './user-roles-form.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class UserRolesFormComponent implements OnInit {

 
  constructor(
    private _dialogRef: MatDialogRef<UserRolesFormComponent>,
    @Inject(MAT_DIALOG_DATA) public user: USER_MANAGEMENT_MODELS.UserModel,
    private _store: Store,
    private _snackbarService: SnackBarsService
  ) { }


  @ViewSelectSnapshot(AuthorizationState.systemRoles) public roles: string[];


  public newRoles: string[] = []

  ngOnInit(): void {
    this._getRoles();
    this.newRoles = [...this.user.permissions];
  }



  public submit(): void {
    this._store.dispatch(new USER_MANAGEMENT_ACTIONS.UpdateUserPermissions({
      organizationEmail: this.user.organizationEmail, 
      newPermissions: this.newRoles})).subscribe(() => {
      this._snackbarService.openSuccessSnackbar({
        
        message: SSAConfigInst.CRUD_CONFIG.successMessages.updated(`User Permissions`),
        duration: 5,
        // showCloseBtn: true
      })
      this._dialogRef.close();
    });
  }


  public isRoleGranted(role): boolean {
    return this.user.permissions.includes(role);
  }

  public onRoleChange($event: MatSlideToggleChange, role: string) {
    if ($event.checked) this.newRoles.push(role);
    else this.newRoles.splice(this.newRoles.indexOf(role), 1)
  }

  public closeDialog(): void {
    this._dialogRef.close();
  }




  @Dispatch() private _getRoles() { return new LoadSystemRoles();}

}
