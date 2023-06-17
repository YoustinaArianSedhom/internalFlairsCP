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
import * as CLIENTS_MODELS from '../../models/clients.models';
import { I } from '@angular/cdk/keycodes';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';

@Component({
  selector: 'customerPortal-modal-delete-portfolio',
  templateUrl: './modal-delete-portfolio.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class ModalDeletePortfolioComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<any>,
    private fb: FormBuilder,
    private http: HttpService,
    private readonly _snacks: SnackBarsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  @ViewSelectSnapshot(OrganizationState.SelectedClient)
  public SelectedClient: CLIENTS_MODELS.Client;

  @ViewSelectSnapshot(OrganizationState.SearchQuery)
  public searchQuery: string;

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  deletePortfolio() {
    this.http
      .post(
        `Portfolio/Delete${buildQueryString({ portfolioid: this.data.id })}`
      )
      .subscribe((data) => {
        let error = data.ErrorMessage;
        if (!error) {
          this._snacks.openSuccessSnackbar({
            message: `${this.data.name} Deleted`,
          });
          this._fireMyOrganization();
        } else {
          // console.log('here');
          this._snacks.openFailureSnackbar({
            message: error,
          });
        }
      });
    this.onNoClick();
  }

  @Dispatch() private _fireMyOrganization() {
    const pagintationForm: PaginationConfigModel = {
      pageSize: 10,
      pageIndex: 0,
    };
    return new CLIENTS_ACTIONS.PaginatePortfolios(pagintationForm);
  }
}
