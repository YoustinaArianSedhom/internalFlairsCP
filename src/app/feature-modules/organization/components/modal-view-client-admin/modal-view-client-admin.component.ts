import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpService } from '@core/http/http/http.service';
import { OrganizationState } from '@modules/organization/state/organization.state';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select } from '@ngxs/store';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import * as ORGANIZATION_ACTIONS from '../../state/organization.actions';
import * as ORGANIZATION_MODELS from '../../models/clients.models';
import { Observable } from 'rxjs';
import { BasicSelectConfigModel } from '@shared/modules/selects/model/selects.model';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import {
  TableCellAligns,
  TableCellTypes,
} from '@shared/modules/tables/model/tables.config';
import {
  TableConfigModel,
  TableActionModel,
} from '@shared/modules/tables/model/tables.model';
import { SSAConfigInst } from 'src/app/config/app.config';
import { ModalCreateAdminComponent } from '../modal-create-admin/modal-create-admin.component';
import { ModalDeleteClientComponent } from '../modal-delete-client/modal-delete-client.component';
import { ModalEditClientComponent } from '../modal-edit-client/modal-edit-client.component';
import { TablesService } from '@shared/modules/tables/model/tables.service';
import { UserModel } from '@modules/user-management/model/user-management.models';

@Component({
  selector: 'customerPortal-modal-view-client-admin',
  templateUrl: './modal-view-client-admin.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class ModalViewClientAdminComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<any>,
    private fb: FormBuilder,
    private http: HttpService,
    private readonly _snacks: SnackBarsService,
    private _tableService: TablesService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.AddClientForm = this.fb.group({
      name: ['', Validators.required],
      title: ['', Validators.required],
      clientEmail: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      clientIDS: [[], Validators.required],
      portfolioIDS: [[]],
      TeamIDS: [[]],
      profileImage: [''],
    });
  }

  AddClientForm: FormGroup;
  errorMsg: string;
  profileImage: string;
  imageTypes = ['image/png', 'image/jpeg', 'image/jpg'];

  onNoClick(): void {
    this.dialogRef.close();
  }

  public user: UserModel;

  // @Input() clientID;
  @Output() OpenModal = new EventEmitter<string>();

  // @Select(UserState.user) public user$: Observable<UserModel>;

  @Select(OrganizationState.Admins) public Admins$: Observable<
    ORGANIZATION_MODELS.Admin[]
  >;

  @ViewSelectSnapshot(OrganizationState.AdminsPaginationConfig)
  public pagination: PaginationConfigModel;

  /*_______________________________________SETUP TABLE CONFIG_________________________________*/
  public tableConfig: TableConfigModel = {
    actions: [
      {
        key: 'Add Admin',
        label: 'Add Admin To account',
        hideCondition: (record: ORGANIZATION_MODELS.Admin) => {
          return false;
        },
      },
      {
        key: 'View Admins',
        label: 'View Accounts Admins',
        hideCondition: (record: ORGANIZATION_MODELS.Client) => {
          return false;
        },
      },
      {
        key: SSAConfigInst.CRUD_CONFIG.actions.update,
        label: 'Edit Account',
        icon: {
          name: 'edit',
        },
        hideCondition: (record: ORGANIZATION_MODELS.Client) => {
          return false;
        },
      },
      {
        key: SSAConfigInst.CRUD_CONFIG.actions.delete,
        label: 'Delete Account',
        icon: {
          name: 'delete',
        },
        hideCondition: (record: ORGANIZATION_MODELS.Client) => {
          return false;
        },
      },
    ],
    keys: ['Image', 'Name', 'Title'],
    columns: [
      {
        key: 'Image',
        head: 'Image',
        hidden: false,
        value: (record: ORGANIZATION_MODELS.Admin) => {
          return record.profileImageLink
            ? record.profileImageLink
            : 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/600px-No_image_available.svg.png';
        },
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
        value: (record: ORGANIZATION_MODELS.Admin) => {
          return record.fullName;
        },
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
      },
      {
        key: 'Title',
        head: 'Title',
        hidden: false,
        value: (record: ORGANIZATION_MODELS.Admin) => {
          return record.title;
        },
        view: {
          width: 30,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
      },
    ],
  };

  /*__________________________________________TABLE INITIATION____________________________________*/

  ngOnInit(): void {
    this._tableService.setupConfig(this.tableConfig);
    this._fireAdminssable();
    // this._fireGetEntities();
  }

  mapTableAction({
    record,
    action,
  }: {
    record: ORGANIZATION_MODELS.Admin;
    action: TableActionModel;
  }) {
    // const takeActionParameter: ORGANIZATION_MODELS.MyTasksActionTaken = {
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

  @Dispatch() private _setSelectedClient(id) {
    return new ORGANIZATION_ACTIONS.setClientSelected(id);
  }

  @Dispatch() private _fireAdminssable() {
    return new ORGANIZATION_ACTIONS.getAdmins(this.data);
  }

  @Dispatch() private _changeTableMode() {
    return new ORGANIZATION_ACTIONS.changeTableMode(1);
  }

  @Dispatch() private _fireGetPortfoliosByClientId(id) {
    let filters: ORGANIZATION_MODELS.Filtration;
    filters = {
      accountId: id,
    };
    return new ORGANIZATION_ACTIONS.getPortfolios(filters);
  }

  @Dispatch() public firePaginateAdmins(pagination: PaginationConfigModel) {
    // console.log('fired pagination', pagination);
    const pagintationForm: PaginationConfigModel = {
      pageSize: pagination.pageSize,
      pageIndex: pagination.pageNumber,
    };
    return new ORGANIZATION_ACTIONS.PaginateAdmins(pagintationForm, this.data);
  }

  // @Dispatch() private _fireMyOrganization() {
  //   return new CLIENTS_ACTIONS.getClients({});
  // }

  // @Dispatch() private getAllClientsIDS() {
  //   return new CLIENTS_ACTIONS.getClientsIDS('');
  // }

  // @Dispatch() private getAllPortfoliosIDS() {
  //   return new CLIENTS_ACTIONS.getPortfoliosIDS('');
  // }

  // @Dispatch() private getAllTeamsIDS() {
  //   return new CLIENTS_ACTIONS.getTeamsIDS('');
  // }
}
