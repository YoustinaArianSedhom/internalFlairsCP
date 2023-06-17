import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpService } from '@core/http/http/http.service';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import * as ASSIGNED_PROFILE_ACTIONS from '../../state/assigned_profile.actions';
import { Store } from '@ngxs/store';
import { deleteAssignedProfiles } from './../../state/assigned_profile.actions';

@Component({
  selector: 'app-modal-my-teams',
  templateUrl: './modal-assigned-profiles.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class ModalAssignedProfilesComponent {
  constructor(
    public dialogRef: MatDialogRef<any>,
    private fb: FormBuilder,
    private http: HttpService,
    private _store: Store,
    private readonly _snacks: SnackBarsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  @Dispatch() private _refreshMyAssignedProfiles() {
    return new ASSIGNED_PROFILE_ACTIONS.getAssignedProfiles({});
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public deleteAssignedProfile(id: string) {
    this._store.dispatch(new deleteAssignedProfiles(id));
  }
}
