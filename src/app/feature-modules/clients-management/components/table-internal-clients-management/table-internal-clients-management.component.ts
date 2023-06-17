import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { HttpService } from '@core/http/http/http.service';
import { OrganizationState } from '@modules/organization/state/organization.state';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Select } from '@ngxs/store';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import {
  TableCellAligns,
  TableCellTypes,
} from '@shared/modules/tables/model/tables.config';
import {
  TableConfigModel,
  TableActionModel,
} from '@shared/modules/tables/model/tables.model';
import { TablesService } from '@shared/modules/tables/model/tables.service';
import { Observable } from 'rxjs';
import { SSAConfigInst } from 'src/app/config/app.config';
import * as CLIENTS_MANAGEMENT_MODELS from '../../models/clients-management.models';
import * as CLIENTS_MANAGEMENT_CONFIG from '../../models/clients-management.config';
import * as CLIENTS_MANAGEMENT_ACTIONS from '../../state/clients-managements.actions';
import { ClientsManagementState } from '@modules/clients-management/state/clients-managements.state';
import { ModalEditAdminComponent } from '@modules/organization/components/modal-edit-admin/modal-edit-admin.component';
import { ModalEditInternalRolesComponent } from '../modal-edit-internal-roles/modal-edit-internal-roles.component';
import { UserModel } from '@modules/user-management/model/user-management.models';

@Component({
  selector: 'app-table-internal-clients-management',
  templateUrl: './table-internal-clients-management.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class TableInternalClientsManagementComponent implements OnInit {


  // @Select(UserState.user) public user$: Observable<UserModel>;

  @Select(ClientsManagementState.InternalAdmins) public Admins$: Observable<
  CLIENTS_MANAGEMENT_MODELS.InternalAdmin[]
  >;

  @ViewSelectSnapshot(ClientsManagementState.InternalAdminsPaginationConfig)
  public pagination: PaginationConfigModel;

  @Output() OpenModal = new EventEmitter<string>();

  AddClientForm: FormGroup;
  errorMsg: string;
  profileImage: string;
  imageTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  public user: UserModel;

  public tableConfig: TableConfigModel = {
    actions: [
      {
        key: SSAConfigInst.CRUD_CONFIG.actions.update,
        label: 'Edit Roles',
        icon: {
          name: 'edit',
        },
        hideCondition: (record: CLIENTS_MANAGEMENT_MODELS.Client) => false
      },
      // {
      //   key: SSAConfigInst.CRUD_CONFIG.actions.delete,
      //   label: 'Delete Client',
      //   icon: {
      //     name: 'delete',
      //   },
      //   hideCondition: (record: CLIENTS_MANAGEMENT_MODELS.Client) => {
      //     return false;
      //   },
      // },
    ],
    keys: ['Name', 'Email', 'edit-roles'],
    columns: [
      {
        key: 'Name',
        head: 'Name',
        hidden: false,
        value: (record: CLIENTS_MANAGEMENT_MODELS.InternalAdmin) => record.fullName,
        view: {
          width: 5,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            // classes: 'flex align-center text-center',
            align: TableCellAligns.start,
          },
        },
      },
      {
        key: 'Email',
        head: 'Email',
        hidden: false,
        value: (record: CLIENTS_MANAGEMENT_MODELS.InternalAdmin) => record.organizationEmail,
        view: {
          width: 25,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            // classes: 'flex align-center text-center',
            align: TableCellAligns.start,
          },
        },
        type: TableCellTypes.email,
      },
      {
        key: 'edit-roles',
        head: 'Edit Roles',
        hidden: false,
        value: (record: CLIENTS_MANAGEMENT_MODELS.Client) => {
          return {
            key: SSAConfigInst.CRUD_CONFIG.actions.update,
            icon: 'edit',
          };
        },
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.center,
          },
          bodyCell: {
            align: TableCellAligns.center,
            classes: 'cursor-pointer',
          },
        },
        type: TableCellTypes.iconButton
      },
    ],
  };



  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private readonly _snacks: SnackBarsService,
    private _tableService: TablesService,
    public dialog: MatDialog
  ) {}


  @Dispatch() public firePaginateAdmins(pagination: PaginationConfigModel) {
    const pagintationForm: PaginationConfigModel = {
      pageSize: pagination.pageSize,
      pageIndex: pagination.pageIndex,
    };
    return new CLIENTS_MANAGEMENT_ACTIONS.PaginateInternalAdmins(
      pagintationForm
    );
  }

  ngOnInit(): void {
    this._tableService.setupConfig(this.tableConfig);
  }

  mapTableAction({
    record,
    action,
  }: {
    record: CLIENTS_MANAGEMENT_MODELS.InternalAdmin;
    action: TableActionModel;
  }) {
    if (action.key === SSAConfigInst.CRUD_CONFIG.actions.update) {
      this.openEditInternalAdminModal(record);
    }

  }

  // public openModal(id: string) {
  //   let modalData;
  //   this.profiles$.subscribe(
  //     (data) => (modalData = data.filter((record) => record.id === id))
  //   );
  //   const dialogRef = this.dialog.open(ModalProfilesComponent, {
  //     width: '700px',
  //     data: modalData,
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     // console.log('The dialog was closed');
  //   });
  // }

  /*_________________________________________ACTIONS TRIGGERS_______________________________________*/

  openEditInternalAdminModal(Admin: CLIENTS_MANAGEMENT_MODELS.InternalAdmin) {
    const dialogRef = this.dialog.open(ModalEditInternalRolesComponent, {
      width: '500px',
      data: Admin,
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('result', result);
    });
  }
}
