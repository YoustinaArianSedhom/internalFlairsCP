import { Component, OnInit } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import * as ADMINS_ASSIGNMENTS_ACTIONS from '@modules/admins-assignments/state/admins-assignments.actions'
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { AdminsAssignmentsState } from '../../state/admins-assignments.state';
import * as ADMINS_ASSIGNMENTS_MODELS from '@modules/admins-assignments/models/admins-assignments.models';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { provideReactiveFormGetters } from '@shared/helpers/provide-reactive-form-getters.helper';
import { MatSelectChange } from '@angular/material/select';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';

@Component({
  selector: 'customerPortal-add-edit-assignments-modal',
  templateUrl: './add-edit-assignments-modal.component.html',
  styleUrls:['./add-edit-assignments-modal.component.scss'],
})
export class AddEditAssignmentsModalComponent implements OnInit {
  @ViewSelectSnapshot(AdminsAssignmentsState.externalAdmins) externalAdmins: ADMINS_ASSIGNMENTS_MODELS.ExternalAdminModel[];
  @ViewSelectSnapshot(AdminsAssignmentsState.internalAdmins) internalAdmins: ADMINS_ASSIGNMENTS_MODELS.InternalAdminModel[];
  public adminAssignmentForm: FormGroup;
  public formControls: { [control: string]: AbstractControl | FormControl };

  constructor(
    private _dialogRef: MatDialogRef<AddEditAssignmentsModalComponent>,
    private _formBuilder: FormBuilder,
    private _store: Store,
    private _snackbar: SnackBarsService,

  ) { }

  @Dispatch() private _fireGetAllExternalAdmins() { return new ADMINS_ASSIGNMENTS_ACTIONS.GetAllExternalAdmins() }

  ngOnInit(): void {
    this._fireGetAllExternalAdmins();
    this._initForm();
  }

  public onExternalAdminChange(ev:MatSelectChange){
    //should add Tree API here
    this.formControls.profileId.disable()
    this.formControls.profileId.setValue(null)
    this._store.dispatch(new ADMINS_ASSIGNMENTS_ACTIONS.GetAllInternalAdmins(ev.value)).subscribe(res=>{
      this.formControls.profileId.enable()
    })
  }

  public onInternalAdminChange(ev:MatSelectChange){
    console.log('internal Admin Id: ', ev.value)
  }
  

  public cancel() {
    this._dialogRef.close();
  }

  public submit(){
    const val = this.adminAssignmentForm.getRawValue();
    this._store.dispatch(new ADMINS_ASSIGNMENTS_ACTIONS.ScheduleAnAdmin(val)).subscribe(res=>{
      this._store.dispatch(new ADMINS_ASSIGNMENTS_ACTIONS.GetSchedules())
      this.cancel();
      this._snackbar.openSuccessSnackbar({
        message: `Assignment has been done successfully`,
        duration: 5,
      });
    })
  }

  private _initForm(){
    this.adminAssignmentForm = this._formBuilder.group({
      clientProfileId: [{value: '', disabled: false}, [Validators.required]],
      profileId: [{value: '', disabled: true}, [Validators.required]],
    });
    this.formControls = provideReactiveFormGetters(this.adminAssignmentForm, '');
  }

}
