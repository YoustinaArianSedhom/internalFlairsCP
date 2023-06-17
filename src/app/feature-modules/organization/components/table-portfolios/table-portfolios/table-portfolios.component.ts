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
import { ModalDeletePortfolioComponent } from '../../modal-delete-portfolio/modal-delete-portfolio.component';
import { ModalEditPortfolioComponent } from '../../modal-edit-portfolio/modal-edit-portfolio.component';
import { UserModel } from '@modules/user-management/model/user-management.models';

@Component({
  selector: 'ssa-table-portfolios',
  templateUrl: './table-portfolios.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class TablePortfoliosComponent implements OnInit {
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

  @Select(OrganizationState.Portfolios) public Portfolios$: Observable<
    ORGANIZATION_MODELS.Portfolios[]
  >;

  @ViewSelectSnapshot(OrganizationState.SelectedClient)
  public SelectedClient: ORGANIZATION_MODELS.Client;

  @ViewSelectSnapshot(OrganizationState.portfolioPaginationConfig)
  public pagination: PaginationConfigModel;

  /*_______________________________________SETUP TABLE CONFIG_________________________________*/
  public tableConfig: TableConfigModel = {
    actions: [
      {
        key: SSAConfigInst.CRUD_CONFIG.actions.update,
        label: 'Edit Portfolio',
        icon: {
          name: 'edit',
        },
        hideCondition: (record: ORGANIZATION_MODELS.Portfolios) => {
          return false;
        },
      },
      {
        key: SSAConfigInst.CRUD_CONFIG.actions.delete,
        label: 'Delete Portfolio',
        icon: {
          name: 'delete',
        },
        hideCondition: (record: ORGANIZATION_MODELS.Portfolios) => {
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
        value: (record: ORGANIZATION_MODELS.Portfolios) => {
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
        value: (record: ORGANIZATION_MODELS.Portfolios) => {
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
        value: (record: ORGANIZATION_MODELS.Portfolios) => {
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
    let clientID = this.route.snapshot.params['clientdID'];
    this._fireGetPortfoliosByClientId(clientID);
    if (!this.SelectedClient) {
      this._getAndSetClientById(clientID);
    }
    this._tableService.setupConfig(this.tableConfig);
    // this._fireClientsable();
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
      this.openEditPortfolioModal(record);
    } else if (action.key == SSAConfigInst.CRUD_CONFIG.actions.delete) {
      this.openDeletePortfolioModal(record);
    } else if (action.key == 'name') {
      this._router.navigate([`/organization/teams/${record.id}`]);
      this._setSelectedPortfolio(record);
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

  openEditPortfolioModal(client: ORGANIZATION_MODELS.Client) {
    console.log(client);
    const dialogRef = this.dialog.open(ModalEditPortfolioComponent, {
      width: '650px',
      data: client,
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('The dialog was closed');
    });
  }

  openDeletePortfolioModal(record) {
    const dialogRef = this.dialog.open(ModalDeletePortfolioComponent, {
      width: '500px',
      data: record,
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  /*_________________________________________ACTIONS TRIGGERS_______________________________________*/

  @Dispatch() private _setSelectedPortfolio(id) {
    return new ORGANIZATION_ACTIONS.setPortfolioSelected(id);
  }

  @Dispatch() private _fireGetPortfoliosByClientId(id) {
    let filters: ORGANIZATION_MODELS.Filtration;
    filters = {
      accountId: id,
    };
    return new ORGANIZATION_ACTIONS.getPortfolios(filters);
  }

  @Dispatch() private _getAndSetClientById(id) {
    return new ORGANIZATION_ACTIONS.getAndSetClientById(id);
  }

  @Dispatch() public firePaginateMyTeams(pagination: PaginationConfigModel) {
    // console.log('fired pagination', this.pagination);
    const pagintationForm: PaginationConfigModel = {
      pageSize: pagination.pageSize,
      pageIndex: pagination.pageIndex,
    };
    return [
      new ORGANIZATION_ACTIONS.setFilters({ accountId: this.SelectedClient.id }),
      new ORGANIZATION_ACTIONS.PaginatePortfolios(pagintationForm),
    ];
  }
}
