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
import { MatRadioChange } from '@angular/material/radio';
import { AssignedProfileModel } from '@modules/assigned-profiles/state/assigned_profile.state';

@Component({
  selector: 'customerPortal-modal-edit-end-association',
  templateUrl: './modal-edit-end-association.component.html',
  styleUrls:  ['./modal-edit-end-association.component.scss'],
})
export class ModalEditEndAssociationComponent implements OnInit {

  public editEndAssociationForm: FormGroup;
  public formControls: { [control: string]: AbstractControl | FormControl };
  public leaveTypes = ASSIGNED_PROFILE_CONFIGS.EMPLOYEE_LEAVE;
  public turnOverTypesArray = ASSIGNED_PROFILE_CONFIGS.TURN_OVER_TYPES;
  public terminationReasons: ASSIGNED_PROFILE_MODELS.ClientModel[] ;
  public VoluntaryLeaves: ASSIGNED_PROFILE_MODELS.ClientModel[] ;
 

  constructor(
    private _dialogRef: MatDialogRef<ModalEditEndAssociationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ASSIGNED_PROFILE_MODELS.ProfilesModel,
    private _formBuilder: FormBuilder,
    private _validatorsService: ValidationService,
    private _store: Store,
    private _snackbar: SnackBarsService,
    private _assignedProfilesService: AssignedProfilesService
  ) { }

  ngOnInit(): void {

    this._initForm();
    this._assignedProfilesService
      .getTerminationReasons()
      .subscribe((val) => (this.terminationReasons = val));
    this._assignedProfilesService
      .getIsVoluntaryLeave()
      .subscribe((val) => (this.VoluntaryLeaves = val));
  }

  public closeDialog() {
    this._dialogRef.close();
  }
  public isDoneWithClientChange(ev: MatRadioChange): void {
    let formControls = ['terminationReason','voluntaryLeave','turnoverType']
    if (ev.value) {
      this.changeFormControlsValidation(formControls,[Validators.required])
    }
    else {
      this.changeFormControlsValidation(formControls,null)
      this.editEndAssociationForm.patchValue({ terminationReason : null, voluntaryLeave: null, turnoverType: null})
    }


  }
  public changeFormControlsValidation(controls: string[], validations: ValidatorFn | ValidatorFn[]): void{
    controls.map(control=>{
      this.formControls[control].setValidators(validations)
      this.formControls[control].updateValueAndValidity()
    })
  }

  public submit() {
    const form :ASSIGNED_PROFILE_MODELS.EditEndAssociationModel= {
      ...this.editEndAssociationForm.value,
      terminationReason: this.editEndAssociationForm.controls.terminationReason
        .value
        ? +this.editEndAssociationForm.controls.terminationReason.value
        : null,
      voluntaryLeave: this.editEndAssociationForm.controls.voluntaryLeave
        .value
        ? +this.editEndAssociationForm.controls.voluntaryLeave.value
        : null,
      Id: this.data.id,
    };

    this._store
      .dispatch(new ASSIGNED_PROFILE_ACTIONS.EditEndAssociation(form))
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

  private _initForm() {
    this.editEndAssociationForm = this._formBuilder.group(
      {
        terminationReason: [null],
        voluntaryLeave: [null],
        turnoverType: [[]],
        isDoneWithClient: [false, Validators.required],
      },
     
      {}
    );
    this.formControls = provideReactiveFormGetters(this.editEndAssociationForm, '');
  }

}
