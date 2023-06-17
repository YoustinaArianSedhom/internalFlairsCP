import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpService } from '@core/http/http/http.service';
import { TEAMS_STATUS_OPTIONS } from '@modules/my-accounts/models/my-accounts.config';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import * as CLIENTS_ACTIONS from '../../state/organization.actions';
import * as CLIENTS_MODELS from '../../models/clients.models';
import * as CLIENTS_CONFIG from '../../models/clients.config';
import { OrganizationState } from '@modules/organization/state/organization.state';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';

@Component({
  selector: 'customerPortal-modal-edit-portfolio',
  templateUrl: './modal-edit-portfolio.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class ModalEditPortfolioComponent implements OnInit {
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
      removeLogo: [false],
    });
  }

  @ViewSelectSnapshot(OrganizationState.SearchQuery)
  public SearchQuery: string;

  AddClientForm: FormGroup;
  errorMsg: string;
  profileImage: string;
  imageTypes = ['image/png', 'image/jpeg', 'image/jpg'];

  public statusChoices = TEAMS_STATUS_OPTIONS;

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.AddClientForm.patchValue({
      name: this.data.name,
      description: this.data.description === null ? '' : this.data.description,
    });
    this.profileImage = this.data.logoImageLink;
    // console.log('portimage', this.profileImage);
  }

  uploadProfileImage(event) {
    // this.AddClientForm.controls.image.setValue('');
    this.AddClientForm.controls.removeLogo.setValue(false);

    this.errorMsg = '';

    // console.log(event.target.files[0].size);
    if (this.imageTypes.indexOf(event.target.files[0].type) === -1) {
      this.errorMsg = 'Invalid Image Type';
    } else if (event.target.files[0].size <= 8000000) {
      this.AddClientForm.controls.logo.setValue(event.target.files[0]);
    } else {
      this.errorMsg = 'Max size is 8 MB';
    }
  }

  onFileChanges(event) {
    // console.log(event[0]);
    if (
      event[0].size <= 8000000 &&
      this.imageTypes.indexOf(event[0].type) !== -1
    ) {
      // console.log('hereooo');
      this.profileImage = event[0].base64;
    }
  }

  removeLogo() {
    this.profileImage = '';
    this.AddClientForm.controls.logo.setValue('');
    this.AddClientForm.controls.removeLogo.setValue(true);
  }

  EditClient(form) {
    // console.log('form', form.logo);
    form = {
      ...form,
      description: form.description.trim(),
      name: form.name.trim(),
    };
    const fullForm = {
      ...form,
      key: this.data.key,
      id: this.data.id,
      AccountId: this.data.account.id,
    };
    const formData = new FormData();
    Object.keys(fullForm).forEach((key) => formData.append(key, fullForm[key]));

    // console.log('after', formData);

    this.http.post('Portfolio/Update', formData).subscribe((data) => {
      if (!data.errorMessage) {
        this._snacks.openSuccessSnackbar({
          message: `${this.data.name} Was edited successfully`,
        });
        this._fireMyOrganization();
      } else {
        this._snacks.openFailureSnackbar({
          message: data.errorMessage,
        });
      }
    });

    this.onNoClick();
  }

  @Dispatch() private _fireMyOrganization() {
    console.log('hereeeeeee')
    return new CLIENTS_ACTIONS.getPortfolios({
      accountId: this.data.account.id,
      searchQuery: this.SearchQuery,
    });
  }

  calculateRemainingChars(max, length) {
    return max - length;
  }
}
