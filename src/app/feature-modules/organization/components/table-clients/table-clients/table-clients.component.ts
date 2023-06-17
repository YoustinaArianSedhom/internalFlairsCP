import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  TableCellAligns,
  TableCellTypes,
} from '@shared/modules/tables/model/tables.config';
import {
  TableActionModel,
  TableColumnSortModel,
  TableConfigModel,
  tableWithNoteCellModel,
} from '@shared/modules/tables/model/tables.model';
import { SSAConfigInst } from 'src/app/config/app.config';
import * as ORGANIZATION_MODELS from '../../../models/clients.models';
import * as ORGANIZATION_CONFIGS from '../../../models/clients.config';
import * as ORGANIZATION_ACTIONS from '../../../state/organization.actions';
import { TablesService } from '@shared/modules/tables/model/tables.service';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select, Store } from '@ngxs/store';
import { ProfileState } from '@modules/profiles/state/profiles.state';
import { Observable } from 'rxjs';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizationState } from '@modules/organization/state/organization.state';
import { ModalDeleteClientComponent } from '../../modal-delete-client/modal-delete-client.component';
import { ModalEditClientComponent } from '../../modal-edit-client/modal-edit-client.component';
import { ModalCreateAdminComponent } from '../../modal-create-admin/modal-create-admin.component';
import { ModalViewClientAdminComponent } from '../../modal-view-client-admin/modal-view-client-admin.component';
import { UserModel } from '@modules/user-management/model/user-management.models';

@Component({
  selector: 'ssa-table-clients',
  templateUrl: './table-clients.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class TableClientsComponent implements OnInit {
  constructor(
    private _tableService: TablesService,
    private _store: Store,
    private _snackbarService: SnackBarsService,
    private _router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  public user: UserModel;

  // @Input() clientID;
  @Output() OpenModal = new EventEmitter<string>();

  // @Select(UserState.user) public user$: Observable<UserModel>;

  @Select(OrganizationState.Clients) public Clients$: Observable<
    ORGANIZATION_MODELS.Client[]
  >;

  @ViewSelectSnapshot(OrganizationState.paginationConfig)
  public pagination: PaginationConfigModel;

  /*_______________________________________SETUP TABLE CONFIG_________________________________*/
  public tableConfig: TableConfigModel = {
    actions: [
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
    keys: ['logo', 'name', 'description', 'actions'],
    columns: [
      {
        key: 'logo',
        head: 'Logo',
        hidden: false,
        value: (record: ORGANIZATION_MODELS.Client) => {
          return record.logoImageLink
            ? record.logoImageLink
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
        key: 'name',
        head: 'Name',
        hidden: false,
        value: (record: ORGANIZATION_MODELS.Client) => {
          return {
            key: 'name',
            label: record.name,
          };
        },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            // classes: 'flex align-center text-center',
            align: TableCellAligns.start,
            classes: 'underline cursor-pointer text-primary',
          },
        },
        type: TableCellTypes.eventEmitter,
      },
      {
        key: 'description',
        head: 'Description',
        // sort: {
        //   sortField: 1,
        //   sortType: SSAConfigInst.CRUD_CONFIG.sort.asc,
        //   disableClear: true,
        // },
        hidden: false,
        value: (record: ORGANIZATION_MODELS.Client) => {
          return record.description;
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
    this._fireClientsable();
    // this._fireGetEntities();
  }

  mapTableAction({
    record,
    action,
  }: {
    record: ORGANIZATION_MODELS.Client;
    action: TableActionModel;
  }) {
    if (action.key == SSAConfigInst.CRUD_CONFIG.actions.update) {
      this.openEditClientModal(record);
    } else if (action.key == SSAConfigInst.CRUD_CONFIG.actions.delete) {
      this.openDeleteClientModal(record);
    } else if (action.key == 'View Admins') {
      // this.openViewAdmins(record.id);
      this._router.navigate([`clients-management/external/${record.id}`]);
    } else if (action.key == 'name') {
      this._router.navigate([`organization/portfolios/${record.id}`]);
      // this._fireGetPortfoliosByClientId(record.id);
      this._setSelectedClient(record);
    }
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

  openEditClientModal(client: ORGANIZATION_MODELS.Client) {
    const dialogRef = this.dialog.open(ModalEditClientComponent, {
      width: '650px',
      data: client,
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('The dialog was closed');
    });
  }

  openDeleteClientModal(record) {
    const dialogRef = this.dialog.open(ModalDeleteClientComponent, {
      width: '500px',
      data: record,
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  openAddAdminToClient() {
    const dialogRef = this.dialog.open(ModalCreateAdminComponent, {
      width: '500px',
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  openViewAdmins(id) {
    const dialogRef = this.dialog.open(ModalViewClientAdminComponent, {
      width: '500px',
      data: id,
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  @Dispatch() private _setSelectedClient(id) {
    return new ORGANIZATION_ACTIONS.setClientSelected(id);
  }

  @Dispatch() private _fireClientsable() {
    return new ORGANIZATION_ACTIONS.getClients({});
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

  @Dispatch() public firePaginateMyTeams(pagination: PaginationConfigModel) {
    // console.log('fired pagination', pagination);
    const pagintationForm: PaginationConfigModel = {
      pageSize: pagination.pageSize,
      pageIndex: pagination.pageIndex,
    };
    return new ORGANIZATION_ACTIONS.PaginateClients(pagintationForm);
  }
}
