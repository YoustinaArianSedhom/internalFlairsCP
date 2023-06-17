import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpService } from '@core/http/http/http.service';
import { OrganizationState } from '@modules/organization/state/organization.state';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { buildQueryString } from '@shared/helpers/build-query-string.helper';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import * as CLIENTS_ACTIONS from '../../state/organization.actions';

@Component({
  selector: 'customerPortal-modal-delete-client',
  templateUrl: './modal-delete-client.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class ModalDeleteClientComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<any>,
    private fb: FormBuilder,
    private http: HttpService,
    private readonly _snacks: SnackBarsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  @ViewSelectSnapshot(OrganizationState.SearchQuery)
  public searchQuery: string;

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  deleteClient() {
    this.http
      .post(`Account/Delete${buildQueryString({ accountId: this.data.id })}`)
      .subscribe((data) => {
        if (!data.errorMessage) {
          this._snacks.openSuccessSnackbar({
            message: `${this.data.name} Deleted`,
          });
          this._fireMyClients();
        }
      });
    this.onNoClick();
  }

  @Dispatch() private _fireMyClients() {
    return new CLIENTS_ACTIONS.getClients({
      searchQuery: this.searchQuery,
    });
  }
}
