import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import * as ASSIGNED_PROFILE_MODELS from '@modules/assigned-profiles/models/assigned-profile.model'
import * as ASSIGNED_PROFILE_ACTIONS from '@modules/assigned-profiles/state/assigned_profile.actions'
import { provideReactiveFormGetters } from '@shared/helpers/provide-reactive-form-getters.helper';
import moment from 'moment';
@Component({
  selector: 'customerPortal-toggle-contract-type-form',
  templateUrl: './toggle-contract-type-form.component.html',
  styles: [
    `
      :host {
        display: block;
      }
      p{
        margin: 0px
      }
    `
  ]
})
export class ToggleContractTypeFormComponent implements OnInit {
  public toggleContractForm: FormGroup;
  public formControls: { [control: string]: AbstractControl | FormControl };
  public hintDate = {
    from: moment().utc(false).format(),
    to: moment().add(1,'day').utc(false).format()
  }

  constructor(
    private _dialogRef: MatDialogRef<ToggleContractTypeFormComponent>,
    private fb: FormBuilder,
    private _store: Store,
    private readonly _snackbar: SnackBarsService,
    @Inject(MAT_DIALOG_DATA) public data: ASSIGNED_PROFILE_MODELS.ProfilesModel
  ) { }

  ngOnInit(): void {
    this._initForm();
    if(+this.data.contractType){
      this.formControls.billingRate.setValidators([Validators.required, Validators.maxLength(6), Validators.pattern(/^[0-9]*$/),]);
      this.formControls.billingRate.updateValueAndValidity();
    }
  }
  public submit(){
    let body : ASSIGNED_PROFILE_MODELS.ChangeContractTypeBodyModel = {
      ...this.toggleContractForm.getRawValue(),
      billingRate: +this.formControls.billingRate.value
    }
    this._store.dispatch(new ASSIGNED_PROFILE_ACTIONS.ChangeContractType(body)).subscribe(()=>{
      this._snackbar.openSuccessSnackbar({
        message: `${this.data.fullName} Contract changed successfully.`,
        duration: 5,
      });
      this._store.dispatch(
        new ASSIGNED_PROFILE_ACTIONS.filterAssignedProfiles()
      );
      this.cancel();
    })
  }
  public cancel() {
    this._dialogRef.close();
  }

  private _initForm(): void {
    this.toggleContractForm = this.fb.group({
      id: [this.data.id],
      billingRate: [null]
    });
    this.formControls = provideReactiveFormGetters(this.toggleContractForm, '');
  }

}
