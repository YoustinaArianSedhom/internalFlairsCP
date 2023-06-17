import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpService } from '@core/http/http/http.service';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { buildQueryString } from '@shared/helpers/build-query-string.helper';

@Component({
  selector: 'app-modal-edit-client-roles',
  templateUrl: './modal-edit-profile-roles.component.html',
  styleUrls: ['./modal-edit-profile-roles.component.scss'],
})
export class ModalEditClientRolesComponent implements OnInit {

  AddClientForm: FormGroup;
  isOwnerChecked = false;

  constructor(
    public dialogRef: MatDialogRef<any>,
    private fb: FormBuilder,
    private http: HttpService,
    private readonly _snacks: SnackBarsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.AddClientForm = this.fb.group({});
  }



  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    // console.log('thisdata', this.data);
    this.getRoles();
  }

  getRoles() {
    this.http
      .fetch(
        `Profile/GetRolesByProfileId${buildQueryString({
          profileId: this.data.id,
        })}`
      )
      .subscribe((data) => {
        if (data.result.length && data.result[0] === 'Owner') {
          this.isOwnerChecked = true;
        }
      });
  }

  changeRole() {
    let roles;
    if (this.isOwnerChecked === true) {
      roles = ['Owner'];
    } else {
      roles = [];
    }
    this.http
      .post(
        `Profile/UpdateProfileRoles${buildQueryString({
          profileId: this.data.id,
        })}`,
        roles
      )
      .subscribe((data) => {
        if (!data.errorMessage) {
          this._snacks.openSuccessSnackbar({
            message: `${this.data.fullName} roles has been updated`,
          });
          this.onNoClick();
        } else {
          this._snacks.openFailureSnackbar({
            message: data.errorMessage,
          });
        }
      });
  }
}
