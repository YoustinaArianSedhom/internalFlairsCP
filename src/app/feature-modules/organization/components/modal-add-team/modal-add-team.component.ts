import { HttpService } from '../../../../core/http/http/http.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TEAMS_STATUS_OPTIONS } from '@modules/my-accounts/models/my-accounts.config';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import * as CLIENTS_ACTIONS from '../../state/organization.actions';
import { noWhitespaceValidator } from '@shared/helpers/white-validator-helpers';
import { OrganizationState } from '@modules/organization/state/organization.state';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';

@Component({
  selector: 'customerPortal-modal-add-team',
  templateUrl: './modal-add-team.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class ModalAddTeamComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<any>,
    private fb: FormBuilder,
    private readonly _snacks: SnackBarsService,
    private http: HttpService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log('test',this.data);
    this.AddTeamForm = this.fb.group({
      Name: ['', Validators.required],
      Description: [''],
      logo: [''],
      AccountId: [''],
      PortfolioId: [''],
      removeLogo: [false],
    });
  }

  @ViewSelectSnapshot(OrganizationState.SearchQuery)
  public searchQuery: string;

  AddTeamForm: FormGroup;
  modalTitle: string = 'Add Platform';
  modalButton: string = 'Add';
  errorMsg: string;
  profileImage: string;
  imageTypes = ['image/png', 'image/jpeg', 'image/jpg'];

  public statusChoices = TEAMS_STATUS_OPTIONS;

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    if (this.data.edit) {
      this.modalTitle = 'Edit Platform';
      this.modalButton = 'Save';
      this.AddTeamForm.patchValue({
        Name: this.data.edit.team.name,
        Description:
          this.data.edit.team.description === null
            ? ''
            : this.data.edit.team.description,
      });
      this.profileImage = this.data.edit.team.logoImageLink;
    }
  }

  removeIamge() {
    this.profileImage = '';
    this.AddTeamForm.controls.logo.setValue('');
    this.AddTeamForm.controls.removeLogo.setValue(true);
  }

  uploadProfileImage(event) {
    // this.AddClientForm.controls.image.setValue('');
    this.AddTeamForm.controls.removeLogo.setValue(false);

    this.errorMsg = '';

    if (this.imageTypes.indexOf(event.target.files[0].type) === -1) {
      this.errorMsg = 'Invalid Image Type';
    } else if (event.target.files[0].size <= 8000000) {
      this.AddTeamForm.controls.logo.setValue(event.target.files[0]);
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

  addTeam(form) {
    form = {
      ...form,
      Description:
        form.Description !== null ? form.Description.trim() : form.Description,
      Name: form.Name.trim(),
    };
    let formData: any = new FormData();
    if (!this.data.edit) {
      formData.append('Name', form.Name);
      formData.append('Description', form.Description);
      formData.append('PortfolioId', this.data.portfolio.id);
      formData.append('AccountId', this.data.client.id);
      formData.append('Logo', form.logo);
      this.http.post('Platform/Create', formData).subscribe((data) => {
        if (!data.errorMessage) {
          this._snacks.openSuccessSnackbar({
            message: 'New Platform Was created successfully',
          });
          this._fireMyOrganization();
        } else {
          this._snacks.openFailureSnackbar({
            message: data.errorMessage,
          });
        }
      });
    } else if (this.data.edit) {
      formData.append('Id', this.data.edit.team.id);
      formData.append('Name', form.Name);
      formData.append('RemoveLogo', form.removeLogo);
      formData.append('Description', form.Description);
      formData.append('PortfolioId', this.data.portfolio.id);
      formData.append('AccountId', this.data.client.id);
      formData.append('Logo', form.logo);
      this.http.post('Platform/Update', formData).subscribe((data) => {
        if (!data.errorMessage) {
          this._snacks.openSuccessSnackbar({
            message: `${form.Name} Was updated successfully`,
          });
          this._fireMyOrganization();
        } else {
          this._snacks.openFailureSnackbar({
            message: data.errorMessage,
          });
        }
      });
    }
    this.onNoClick();
  }

  calculateRemainingChars(max, length) {
    return max - length;
  }

  @Dispatch() private _fireMyOrganization() {
    return new CLIENTS_ACTIONS.getTeams({
      portfolioId: this.data.portfolio.id,
      searchQuery: this.searchQuery,
    });
  }
}
