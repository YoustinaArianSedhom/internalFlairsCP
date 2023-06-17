import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpService } from '@core/http/http/http.service';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { of } from 'rxjs';
import { buildQueryString } from '@shared/helpers/build-query-string.helper';
import { HttpClient } from '@angular/common/http';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import * as CLIENTS_MANAGEMENT_ACTIONS from '../../state/clients-managements.actions';

@Component({
  selector: 'app-modal-edit-client-roles',
  templateUrl: './modal-edit-internal-roles.component.html',
  styleUrls: ['./modal-edit-internal-roles.component.scss'],
})
export class ModalEditInternalRolesComponent implements OnInit, AfterViewInit {
  isOwnerChecked: boolean;
  isInternalAdminChecked: boolean;
  checkedIDS = undefined;
  checkedIDS$;
  Organization = {
    clientIDS: [],
    portfolioIDS: [],
    teamIDS: [],
    Departments: [],
  };

  constructor(
    public dialogRef: MatDialogRef<any>,
    private fb: FormBuilder,
    private http: HttpService,
    private _httpClient: HttpClient,
    private readonly _snacks: SnackBarsService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  @Dispatch() fireInternalAdminsTable() {
    return new CLIENTS_MANAGEMENT_ACTIONS.FilterInternalAdmins();
  }

  // @Select(OrganizationState.ClientIDS)
  // public ClientIDS$: Observable<CLIENTS_MODELS.Client>;

  // @Select(OrganizationState.PortfoliosIDS)
  // public PortfoliosIDS$: Observable<CLIENTS_MODELS.Portfolios>;

  // @Select(OrganizationState.TeamIDS)
  // public TeamIDS$: Observable<CLIENTS_MODELS.Teams>;

  setOrganization(organization: any) {
    this.Organization.clientIDS = organization.clientIDS;
    this.Organization.portfolioIDS = organization.portfolioIDS;
    this.Organization.teamIDS = organization.teamIDS;
    this.Organization.Departments = organization.departmentsIDS;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  // onOwnerChange(event: any) {
  //   if (event.checked) {
  //     this.isInternalAdminChecked = false;
  //   }
  // }

  // onInternalAdminChange(event: any) {
  //   if (event.checked) {
  //     this.isOwnerChecked = false;
  //   }
  // }

  ngOnInit(): void {
    this.getRoles();
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
    console.log('all done loading :)');
  }

  getRoles() {
    this.http
      .fetch(
        `Profile/GetRolesByProfileId${buildQueryString({
          profileId: this.data.id,
        })}`
      )
      .subscribe(({ result }) => {
        if (result) {
          console.log('result', result);
          this.isOwnerChecked = result.roles.includes('Super Admin');
          this.isInternalAdminChecked = result.roles.includes('Internal Admin')
          this.checkedIDS = {
            clientIDS: result.accountsIds,
            portfolioIDS: result.execulusiveAllowedPortfoliosIds,
            TeamIDS: result.execulusiveAllowedPlatformsIds,
            departmentsIDS: result.execulusiveAllowedDepartments,
          };
          this.checkedIDS$ = of(this.checkedIDS);
        }
      });
  }

  changeRole() {
    let payload;
    payload = {
      profileId: this.data.id,
      roles: []
    }
    if(this.isOwnerChecked){
      payload.roles.push('Super Admin');
    } 
    if (this.isInternalAdminChecked) {
      payload = {
        ...payload,
        roles: [...payload.roles,'Internal Admin'],
        accountsIds: this.Organization.clientIDS,
        portfoliosIds: this.Organization.portfolioIDS,
        platformsIds: this.Organization.teamIDS,
        departments: this.Organization.Departments
      }
    }
    this.http.post(`Profile/UpdateProfileRoles`, payload).subscribe((data) => {
      if (!data.errorMessage) {
        this._snacks.openSuccessSnackbar({
          message: `${this.data.fullName} roles has been updated`,
        });
        this.fireInternalAdminsTable();
        this.onNoClick();
      } else {
        this._snacks.openFailureSnackbar({
          message: data.errorMessage,
        });
      }
    });
  }
}
