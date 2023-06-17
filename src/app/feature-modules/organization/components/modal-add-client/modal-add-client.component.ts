import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpService } from '@core/http/http/http.service';
import { OrganizationState } from '@modules/organization/state/organization.state';
import { TEAMS_STATUS_OPTIONS } from '@modules/my-accounts/models/my-accounts.config';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import * as CLIENTS_ACTIONS from '../../state/organization.actions';

@Component({
  selector: 'customerPortal-modal-add-client',
  templateUrl: './modal-add-client.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class ModalAddClientComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<any>,
    private fb: FormBuilder,
    private http: HttpService,
    private readonly _snacks: SnackBarsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.AddClientForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      logo: [''],
    });
  }

  @ViewSelectSnapshot(OrganizationState.SearchQuery)
  public searchQuery: string;

  AddClientForm: FormGroup;
  errorMsg: string;
  profileImage: string;
  imageTypes = ['image/png', 'image/jpeg', 'image/jpg'];

  public statusChoices = TEAMS_STATUS_OPTIONS;

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {}

  uploadProfileImage(event) {
    // this.AddClientForm.controls.image.setValue('');
    this.errorMsg = '';

    if (this.imageTypes.indexOf(event.target.files[0].type) === -1) {
      this.errorMsg = 'Invalid Image Type';
    } else if (event.target.files[0].size <= 8000000) {
      this.AddClientForm.controls.logo.setValue(event.target.files[0]);
    } else {
      this.errorMsg = 'Max size is 8 MB';
    }
  }
  onFileChanges(event) {
    if (
      event[0].size <= 8000000 &&
      this.imageTypes.indexOf(event[0].type) !== -1
    ) {
      this.profileImage = event[0].base64;
    }
  }

  addClient(form) {
    form = {
      ...form,
      description: form.description.trim(),
      name: form.name.trim(),
    };
    if (this.AddClientForm.valid) {
      const fullForm = { ...form, key: '123456' };
      const formData = new FormData();
      Object.keys(fullForm).forEach((key) =>
        formData.append(key, fullForm[key])
      );

      this.http.post('Account/Create', formData).subscribe((data) => {
        if (!data.errorMessage) {
          this._snacks.openSuccessSnackbar({
            message: 'New Account Was created successfully',
          });
          this._fireMyOrganization();
        } else {
          this._snacks.openFailureSnackbar({
            message: data.errorMessage,
          });
        }
      });

      this.onNoClick();
    } else {
      this._snacks.openFailureSnackbar({
        message: 'Could not create Account',
      });
    }
  }

  calculateRemainingChars(max, length) {
    return max - length;
  }

  @Dispatch() private _fireMyOrganization() {
    return new CLIENTS_ACTIONS.getClients({
      searchQuery: this.searchQuery,
    });
  }
}
