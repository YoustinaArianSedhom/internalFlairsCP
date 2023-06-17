import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpService } from '@core/http/http/http.service';
import { OrganizationState } from '@modules/organization/state/organization.state';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select } from '@ngxs/store';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import * as CLIENTS_ACTIONS from '../../state/organization.actions';
import * as CLIENTS_MODELS from '../../models/clients.models';
import { Observable } from 'rxjs';
import { BasicSelectConfigModel } from '@shared/modules/selects/model/selects.model';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { buildQueryString } from '@shared/helpers/build-query-string.helper';
import * as CLIENT_MANAGEMENT_ACTIONS from '@modules/clients-management/state/clients-managements.actions';
import { ClientsManagementState } from '@modules/clients-management/state/clients-managements.state';
import * as CLIENTS_MANAGEMENT_MODELS from '@modules/clients-management/models/clients-management.models'
@Component({
  selector: 'customerPortal-modal-edit-admin',
  templateUrl: './modal-edit-admin.component.html',
  styleUrls: ['./modal-edit-admin.component.scss'],
})
export class ModalEditAdminComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<any>,
    private fb: FormBuilder,
    private http: HttpService,
    private readonly _snacks: SnackBarsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.AddClientForm = this.fb.group({
      name: ['', Validators.required],
      title: ['', Validators.required],
      clientEmail: ['', [Validators.required, Validators.email]],
      clientIDS: [[]],
      portfolioIDS: [[]],
      TeamIDS: [[]],
      Departments: [[]],
      profileImage: [''],
      RemoveProfileImage: [false],
      frequencyFeedback: [0],
      frequencyFeedbackValue: [{ value: 2, disabled: true }],
      frequencyFeedbackDate: [{ value: 0, disabled: true }],
      frequencyFeedbackDayOfWeek: [1]
    });
  }

  @Select(OrganizationState.ClientIDS)
  public ClientIDS$: Observable<CLIENTS_MODELS.Client>;

  @Select(OrganizationState.PortfoliosIDS)
  public PortfoliosIDS$: Observable<CLIENTS_MODELS.Portfolios>;

  @Select(OrganizationState.TeamIDS)
  public TeamIDS$: Observable<CLIENTS_MODELS.Teams>;

  @ViewSelectSnapshot(OrganizationState.Tree)
  public Tree: CLIENTS_MODELS.Tree[];

  @ViewSelectSnapshot(ClientsManagementState.filtration)
  public filtration: CLIENTS_MANAGEMENT_MODELS.Filtration;


  AddClientForm: FormGroup;
  errorMsg: string;
  profileImage: string;
  imageTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  hide = true;
  confrimHide = true;
  isClientEmpty: boolean = true;
  isTitleEmpty: boolean = true;

  checkedIDS = undefined;
  public frequencyFeedbackOptions = CLIENTS_MODELS.FREQUENCY_FEEDBACK_OPTIONS
  public frequencyFeedbackDateOptions = CLIENTS_MODELS.FREQUENCY_FEEDBACK_DATE_OPTIONS
  public daysOptions = CLIENTS_MODELS.DAYS_OF_WEEKS_OPTIONS

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.http
      .fetch(
        `ClientProfile/GetById${buildQueryString({
          clientProfileId: this.data.id,
        })}`
      )
      .subscribe((result) => {
        let admin = result.result;
        this.AddClientForm.patchValue({
          name: admin.fullName,
          title: admin.title === null ? '' : admin.title,
          clientEmail: admin.clientEmail,
          profileImage: admin.profileImageLink,
          clientIDS: admin.accountsIds,
          portfolioIDS: admin.portfoliosIds,
          TeamIDS: admin.platformsIds,
          ...(admin.feedbackFrequency && {
            frequencyFeedback : 1,
            frequencyFeedbackDayOfWeek: admin.feedbackFrequency.dayOfWeek,
            frequencyFeedbackValue: admin.feedbackFrequency.weeks
          })
        });
        this.profileImage = admin.profileImageLink;
        this.checkedIDS = {
          clientIDS: admin.accountsIds,
          portfolioIDS: admin.execulusiveAllowedPortfoliosIds,
          TeamIDS: admin.execulusiveAllowedPlatformsIds,
          departmentsIDS: admin.execulusiveAllowedDepartments,
        };
      });

    this.AddClientForm.get('name').valueChanges.subscribe((value) => {
      if (!value.trim().length) {
        this.isClientEmpty = true;
      } else {
        this.isClientEmpty = false;
      }
    });
    this.AddClientForm.get('title').valueChanges.subscribe((value) => {
      if (!value.trim().length) {
        this.isTitleEmpty = true;
      } else {
        this.isTitleEmpty = false;
      }
    });
  }

  setOrganization(organization) {
    // console.log('org', organization);
    this.AddClientForm.controls.clientIDS.setValue(organization.clientIDS);
    this.AddClientForm.controls.portfolioIDS.setValue(
      organization.portfolioIDS
    );
    this.AddClientForm.controls.TeamIDS.setValue(organization.teamIDS);
    this.AddClientForm.controls.Departments.setValue(
      organization.departmentsIDS
    );
  }

  HandleClientsSelection(clientsIDS) {
    this.AddClientForm.controls.clientIDS.setValue(clientsIDS);
    // console.log(this.AddClientForm.controls.clientIDS.value);
  }

  HandlePortfoliosSelection(portfolioIDS) {
    this.AddClientForm.controls.portfolioIDS.setValue(portfolioIDS);
  }

  HandleTeamsSelection(TeamsIDS) {
    this.AddClientForm.controls.TeamIDS.setValue(TeamsIDS);
    // console.log(this.AddClientForm.controls.TeamIDS.value);
  }

  uploadProfileImage(event) {
    // this.AddClientForm.controls.image.setValue('');
    this.errorMsg = '';

    // console.log(event.target.files[0].size);
    if (this.imageTypes.indexOf(event.target.files[0].type) === -1) {
      this.errorMsg = 'Invalid Image Type';
    } else if (event.target.files[0].size <= 8000000) {
      this.AddClientForm.controls.RemoveProfileImage.setValue(false);
      this.AddClientForm.controls.profileImage.setValue(event.target.files[0]);
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

  addClient(form) {
    // console.log('form');
    let updatedForm = {
      FullName: form.name.trim(),
      Title: form.title.trim(),
      ClientEmail: form.clientEmail,
      ProfileImage: form.profileImage,
    };
    if (this.AddClientForm.valid) {
      const formData = new FormData();
      Object.keys(updatedForm).forEach((key) =>
        formData.append(key, updatedForm[key])
      );

      formData.append('id', this.data.id);
      formData.append('RemoveProfileImage', form.RemoveProfileImage);

      for (let i = 0; i < form.clientIDS.length; i++) {
        formData.append(`AccountsIds`, form.clientIDS[i]);
      }

      for (let i = 0; i < form.portfolioIDS.length; i++) {
        formData.append(`PortfoliosIds`, form.portfolioIDS[i]);
      }

      for (let i = 0; i < form.TeamIDS.length; i++) {
        formData.append(`PlatformsIds`, form.TeamIDS[i]);
      }

      for (let i = 0; i < form.Departments.length; i++) {
        formData.append(
          `Departments[${i}].platformId`,
          form.Departments[i].platformId
        );
        let j = 0;
        while (j < form.Departments[i].departments.length) {
          formData.append(
            `Departments[${i}].departments`,
            form.Departments[i].departments[j]
          );
          j++;
        }
      }
      if (this.AddClientForm.controls.frequencyFeedback.value === 1) {
        formData.append('feedbackFrequency.weeks',
          this.AddClientForm.controls.frequencyFeedbackValue.value
        )
        formData.append('feedbackFrequency.dayOfWeek',
          this.AddClientForm.controls.frequencyFeedbackDayOfWeek.value
        )
      }

      // formData.append('PortfoliosIds', JSON.stringify(form.portfolioIDS));
      // formData.append('TeamsIds', JSON.stringify(form.TeamIDS));

      // console.log('after', formData);

      this.http.post('ClientProfile/Update', formData).subscribe((data) => {
        if (!data.errorMessage) {
          this._snacks.openSuccessSnackbar({
            message: `${this.data.fullName} was updated successfully`,
          });
          this._getAdmins();
        } else {
          this._snacks.openFailureSnackbar({
            message: data.errorMessage,
          });
        }
      });

      this.onNoClick();
    }
  }

  calculateRemainingChars(max, length) {
    return max - length;
  }

  @Dispatch() private _getAdmins() {
    return new CLIENT_MANAGEMENT_ACTIONS.GetAdmins(this.filtration);
  }

  @Dispatch() private getAllClientsIDS() {
    return new CLIENTS_ACTIONS.getClientsIDS('');
  }

  @Dispatch() private getAllPortfoliosIDS() {
    return new CLIENTS_ACTIONS.getPortfoliosIDS('');
  }

  @Dispatch() private getAllTeamsIDS() {
    return new CLIENTS_ACTIONS.getTeamsIDS('');
  }

  @Dispatch() private _getOrganization() {
    return new CLIENTS_ACTIONS.getTree();
  }
}
