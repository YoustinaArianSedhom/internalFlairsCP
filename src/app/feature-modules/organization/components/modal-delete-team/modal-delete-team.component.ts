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

@Component({
  selector: 'customerPortal-modal-delete-team',
  templateUrl: './modal-delete-team.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class ModalDeleteTeamComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<any>,
    private fb: FormBuilder,
    private readonly _snacks: SnackBarsService,
    private http: HttpService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  @ViewSelectSnapshot(OrganizationState.SearchQuery)
  public searchQuery: string;

  @ViewSelectSnapshot(OrganizationState.SelectedPortfolio)
  public SelectedPortfolio: CLIENTS_MODELS.Portfolios;

  ngOnInit(): void {
    // console.log(this.data);
  }
  @Dispatch() private _fireMyOrganization() {
    return new CLIENTS_ACTIONS.getTeams({
      portfolioId: this.SelectedPortfolio.id,
      searchQuery: this.searchQuery,
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  deleteTeam() {
    this.http
      .post(`Platform/Delete${buildQueryString({ platformId: this.data.id })}`)
      .subscribe((data) => {
        // console.log(data);
        if (!data.errorMessage) {
          this._snacks.openSuccessSnackbar({
            message: `${this.data.name} Was deleted successfully`,
          });
          this._fireMyOrganization();
          this.onNoClick();
        }
      });
  }
}
