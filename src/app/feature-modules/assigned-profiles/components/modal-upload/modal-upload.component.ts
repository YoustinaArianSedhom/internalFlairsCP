import { Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import * as ASSIGNED_PROFILE_ACTIONS from '@modules/assigned-profiles/state/assigned_profile.actions';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { AssignedProfileState } from '@modules/assigned-profiles/state/assigned_profile.state';
import * as Profile_MODELS from '../../models/assigned-profile.model';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'customerPortal-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: [
    `
      :host {
        display: block;
      }
      mat-icon {
        width: 95px;
        height: auto;
      }
      .warning {
        color: #ffd800;
        font-size: 95px;
      }
    `,
  ],
})
export class ModalUploadComponent {
  @ViewSelectSnapshot(AssignedProfileState.excelUploadSucess)
  public excelUploadSucess: boolean;
  @ViewSelectSnapshot(AssignedProfileState.excelErrors)
  public excelErrors: Profile_MODELS.ExcelErrors[];
  public form: FormGroup;
  public isUploaded: boolean = false;

  constructor(
    private _dialogRef: MatDialogRef<ModalUploadComponent>,
    private _store: Store,
    private _route: Router,
    @Inject(MAT_DIALOG_DATA) public data: boolean
  ) { }

  public canBeImport(event) {
    this.isUploaded = false;
    const form = new FormData();
    form.append('file', event[0].file);
    this._store
      .dispatch(new ASSIGNED_PROFILE_ACTIONS.importExcel(form))
      .subscribe((val) => {
        if (val) {
          this.isUploaded = true;
          if (this.excelErrors?.length && this.data) {
            this.closeDialog();
          }
        }
      });
  }

  public checkErrors() {
    this.closeDialog();
    this._route.navigateByUrl('/assigned-profiles/sheet-errors');
  }

  public exportTemplate(){
    this._store
      .dispatch(new ASSIGNED_PROFILE_ACTIONS.exportTemplateExcel())
  }

  closeDialog() {
    this._dialogRef.close();
  }
}
