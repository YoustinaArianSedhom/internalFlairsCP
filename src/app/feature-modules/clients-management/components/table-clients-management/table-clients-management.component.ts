import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { HttpService } from '@core/http/http/http.service';
import { UserModel } from '@modules/user-management/model/user-management.models';
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

@Component({
  selector: 'app-table-clients-management',
  templateUrl: './table-clients-management.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class TableClientsManagementComponent implements OnInit {

  @Select(ClientsManagementState.Admins) public Admins$: Observable<
    CLIENTS_MANAGEMENT_MODELS.Admin[]
  >;

  @ViewSelectSnapshot(ClientsManagementState.AdminsPaginationConfig)
  public pagination: PaginationConfigModel;

  @Output() OpenModal = new EventEmitter<string>();

  AddClientForm: FormGroup;
  errorMsg: string;
  profileImage: string;
  imageTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  public user: UserModel;

  public tableConfig: TableConfigModel = {
    actions: [
      // {
      //   key: SSAConfigInst.CRUD_CONFIG.actions.update,
      //   label: 'Edit Admin',
      //   icon: {
      //     name: 'edit',
      //   },
      //   hideCondition: (record: CLIENTS_MANAGEMENT_MODELS.Client) => false
      // },
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
    keys: ['Image', 'Name', 'Title', 'Email', 'edit-admin'],
    columns: [
      {
        key: 'Image',
        head: 'Image',
        hidden: false,
        value: (record: CLIENTS_MANAGEMENT_MODELS.Admin) =>
           record.profileImageLink
            ? record.profileImageLink
            : 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/600px-No_image_available.svg.png',
        view: {
          width: 1,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            // classes: 'flex align-center py-2',
            align: TableCellAligns.start,
          },
        },
        type: TableCellTypes.avatar,
      },
      {
        key: 'Name',
        head: 'Name',
        hidden: false,
        value: (record: CLIENTS_MANAGEMENT_MODELS.Admin) => record.fullName,
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
        key: 'Title',
        head: 'Title',
        hidden: false,
        value: (record: CLIENTS_MANAGEMENT_MODELS.Admin) => record.title,
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
      },
      {
        key: 'Email',
        head: 'Email',
        hidden: false,
        value: (record: CLIENTS_MANAGEMENT_MODELS.Admin) => record.clientEmail,
        view: {
          width: 10,
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
        key: 'edit-admin',
        head: 'Edit Admin',
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
    return new CLIENTS_MANAGEMENT_ACTIONS.PaginateAdmins(pagintationForm);
  }

  @Dispatch() private _fireAdminssable() {
    return new CLIENTS_MANAGEMENT_ACTIONS.GetAdmins({});
  }


  /*_______________________________________SETUP TABLE CONFIG_________________________________*/


  /*__________________________________________TABLE INITIATION____________________________________*/

  ngOnInit(): void {
    this._tableService.setupConfig(this.tableConfig);
  }

  mapTableAction({
    record,
    action,
  }: {
    record: CLIENTS_MANAGEMENT_MODELS.Admin;
    action: TableActionModel;
  }) {
    if (action.key === SSAConfigInst.CRUD_CONFIG.actions.update) {
      this.openEditAdminModal(record);
    }
    // const takeActionParameter: CLIENTS_MANAGEMENT_MODELS.MyTasksActionTaken = {
    //   requestId: record.id,
    //   choice: action.key.toUpperCase(),
    // };
    // let successMessage;
    // switch (action.key) {
    //   case 'Approve':
    //     successMessage = 'approved';
    //     break;
    //   case 'Apply':
    //     successMessage = 'applied';
    //     break;
    //   case 'Reject':
    //     successMessage = 'rejected';
    //     break;
    //   default:
    //     return (successMessage = null);
    // }
  }

  /*_________________________________________ACTIONS TRIGGERS_______________________________________*/

  openEditAdminModal(Admin: CLIENTS_MANAGEMENT_MODELS.Admin) {
    const dialogRef = this.dialog.open(ModalEditAdminComponent, {
      width: '500px',
      data: Admin,
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('result', result);
    });
  }
}
