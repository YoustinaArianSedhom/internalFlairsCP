import { Component, OnInit, OnDestroy } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import * as ADMINS_ASSIGNMENTS_ACTIONS from '@modules/admins-assignments/state/admins-assignments.actions'
import * as ADMINS_ASSIGNMENTS_MODELS from '@modules/admins-assignments/models/admins-assignments.models'
import { MatDialog } from '@angular/material/dialog';
import { AddEditAssignmentsModalComponent } from '@modules/admins-assignments/components/add-edit-assignments-modal/add-edit-assignments-modal.component';
import { StateOverwrite } from 'ngxs-reset-plugin';
import { AdminsAssignmentsState, AdminsAssignmentsStateModel } from '@modules/admins-assignments/state/admins-assignments.state';
import { Store } from '@ngxs/store';
@Component({
  selector: 'customerPortal-manage-admins-assignments-page',
  templateUrl: './manage-admins-assignments-page.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class ManageAdminsAssignmentsPageComponent implements OnInit,OnDestroy {
  public headInformation = {
    title: 'Admins assignments for feedback',
  };
  constructor( public dialog: MatDialog, private _store:Store) { }
  @Dispatch() private _fireGetSchedules() { return new ADMINS_ASSIGNMENTS_ACTIONS.GetSchedules()}

  ngOnInit(): void {
    this._fireGetSchedules()
  }

  public openAssignmentsForm(){
    const dialogRef = this.dialog.open(AddEditAssignmentsModalComponent, {
      panelClass: ['form-dialog--small'] 
    });
    dialogRef.afterClosed().subscribe((result) => {});
 
  }

  ngOnDestroy() {
    this._store.dispatch(new StateOverwrite([AdminsAssignmentsState, new AdminsAssignmentsStateModel()]))
  }
}
