import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

import * as USER_MANAGEMENT_MODELS from '@modules/user-management/model/user-management.models';
import { MatDialog } from '@angular/material/dialog';
import { UserRolesFormComponent } from '../user-roles-form/user-roles-form.component';

@Component({
  selector: 'ssa-card-user-management',
  templateUrl: './card-user-management.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class CardUserManagementComponent implements OnInit {

  @Input() public record: USER_MANAGEMENT_MODELS.UserModel;
  @Output() public rolesEdit: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private _matDialog: MatDialog
  ) {
  }

  ngOnInit(): void {
  }


  public openEmployeeRolesForm(record: USER_MANAGEMENT_MODELS.UserModel) {
    this._matDialog.open(UserRolesFormComponent, {
      data: record,
    })
  }


}
