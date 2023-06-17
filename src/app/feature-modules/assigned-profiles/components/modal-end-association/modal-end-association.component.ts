import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormControl, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { provideReactiveFormGetters } from '@shared/helpers/provide-reactive-form-getters.helper';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { ValidationService } from '@shared/modules/validation/validation.service';
import * as ASSIGNED_PROFILE_MODELS from '@modules/assigned-profiles/models/assigned-profile.model';
import * as ASSIGNED_PROFILE_CONFIGS from '@modules/assigned-profiles/models/assigned-profile.config';
import * as ASSIGNED_PROFILE_ACTIONS from '@modules/assigned-profiles/state/assigned_profile.actions';
import { AssignedProfilesService } from '@modules/assigned-profiles/models/assigned-profiles.service';
import * as momentTZ from 'moment-timezone';
import { MatRadioChange } from '@angular/material/radio';
import { MatCheckboxChange } from '@angular/material/checkbox';
@Component({
  selector: 'customerPortal-modal-end-association',
  templateUrl: './modal-end-association.component.html',
  styleUrls: ['./modal-end-association.component.scss']
})
export class ModalEndAssociationComponent implements OnInit {
  public endAssociationForm: FormGroup;

  public formControls: { [control: string]: AbstractControl | FormControl };

  public terminationReasons;

  public isVoluntaryLeave;


  public startDate = new Date();



  public turnOverTypes = ASSIGNED_PROFILE_CONFIGS.TURN_OVER_TYPES

  constructor(
    private _dialogRef: MatDialogRef<ModalEndAssociationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ASSIGNED_PROFILE_MODELS.ProfilesModel,
    private _formBuilder: FormBuilder,
    private _validatorsService: ValidationService,
    private _store: Store,
    private _snackbar: SnackBarsService,
    private _assignedProfilesService: AssignedProfilesService
  ) {}

  ngOnInit(): void {
    this.startDate = new Date(this.data.serviceStartDate);
    this.startDate.setDate(this.startDate.getDate() + 1);
    this._initForm();
    this._assignedProfilesService
      .getTerminationReasons()
      .subscribe((val) => (this.terminationReasons = val));
    this._assignedProfilesService
      .getIsVoluntaryLeave()
      .subscribe((val) => (this.isVoluntaryLeave = val));
  }

  public closeDialog() {
    this._dialogRef.close();
  }

  public submit() {
    const form: ASSIGNED_PROFILE_MODELS.EndAssociationModel = {
      ...this.endAssociationForm.value,
      terminationReason: this.endAssociationForm.controls.terminationReason
        .value
        ? +this.endAssociationForm.controls.terminationReason.value
        : null,
      voluntaryLeave: this.endAssociationForm.controls.voluntaryLeave
        .value
        ? +this.endAssociationForm.controls.voluntaryLeave.value
        : null,
      Id: this.data.id,
      serviceEndDate: this.endAssociationForm.controls.serviceEndDate.value ? momentTZ(this.endAssociationForm.controls.serviceEndDate.value).format('YYYY-MM-DD') : null,

    };

    this._store
      .dispatch(new ASSIGNED_PROFILE_ACTIONS.EndAssociation(form))
      .subscribe((val) => {
        if (val) {
          this._snackbar.openSuccessSnackbar({
            message: `${this.data.fullName} Association has been ended`,
            duration: 5,
          });
          this._store.dispatch(
            new ASSIGNED_PROFILE_ACTIONS.filterAssignedProfiles()
          );
          this.closeDialog();
        }
      });
  }


  public isDoneWithClientChange(ev: MatCheckboxChange): void {
    let formControls = ['terminationReason','voluntaryLeave','turnoverType']
    if (ev.checked) {
      this.changeFormControlsValidation(formControls,[Validators.required])
    }
    else {
      this.changeFormControlsValidation(formControls,null)
      this.endAssociationForm.patchValue({ terminationReason : null, voluntaryLeave: null, turnoverType: null})
    }
  }

  public changeFormControlsValidation(controls: string[], validations: ValidatorFn | ValidatorFn[]): void{
    controls.map(control=>{
      this.formControls[control].setValidators(validations);
      this.formControls[control].updateValueAndValidity();
      this.formControls[control].markAsUntouched();
    })
  }
  private _initForm() {
    this.endAssociationForm = this._formBuilder.group(
      {
        serviceEndDate: [this.startDate, Validators.required],
        terminationReason: [null],
        voluntaryLeave: [null],
        turnoverType: [[]],
        isDoneWithClient: [false, Validators.required],
      },
      {}
    );
    this.formControls = provideReactiveFormGetters(this.endAssociationForm, '');

  }
}
