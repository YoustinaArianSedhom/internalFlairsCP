import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
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
import * as MY_TASKS_MODELS from '../../../models/my-tickets.model';
import * as MY_TASKS_CONFIGS from '../../../models/my-tickets.config';
import * as MY_TASKS_ACTIONS from '../../../state/my-tickets.actions';
import { TablesService } from '@shared/modules/tables/model/tables.service';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select, Store } from '@ngxs/store';
import { MyTeamsState } from '@modules/my-accounts/state/my-accounts.state';
import { Observable } from 'rxjs';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  RequestTeamModel,
  MyTicketModel,
} from '../../../models/my-tickets.model';
import { UserState } from '@core/modules/user/state/user.state';
import { ModalMyTicketsComponent } from '../../modal-my-tickets/modal-my-tickets.component';
import { MyTicketsState } from '@modules/tickets/state/my-tickets.state';
import { TicketsDetailsComponent } from '../../tickets-details/tickets-details.component';
import { UserModel } from '@modules/user-management/model/user-management.models';

@Component({
  selector: 'ssa-table-my-tickets',
  templateUrl: './table-my-tickets.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class TableMyTicketsComponent implements OnInit {
  constructor(
    private _tableService: TablesService,
    private _store: Store,
    private _snackbarService: SnackBarsService,
    private _router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  public user: UserModel;

  public clientID;
  @Output() OpenModal = new EventEmitter<string>();

  // @Select(UserState.user) public user$: Observable<UserModel>;

  @Select(MyTicketsState.myTickets) public myTeams$: Observable<
    MY_TASKS_MODELS.MyTicketModel[]
  >;

  @Select(MyTicketsState.selectedPortfolio)
  public selectedPortfolio$: Observable<MY_TASKS_MODELS.MyTicketModel[]>;

  @ViewSelectSnapshot(MyTicketsState.paginationConfig)
  public pagination: PaginationConfigModel;

  /*_______________________________________SETUP TABLE CONFIG_________________________________*/
  public tableConfig: TableConfigModel = {
    actions: [
      {
        key: SSAConfigInst.CRUD_CONFIG.actions.view,
        label: 'View Resolution',
        icon: {
          name: 'visibility',
          isSVG: false,
        },
        hideCondition: (record: MY_TASKS_MODELS.MyTicketModel) => {
          return false;
        },
      },
    ],
    keys: [
      'ticketNumber',
      'Recruitment Reason',
      'contactName',
      'accountName',
      'status',
      'role',
      'requested',
      'hired',
      'started',
      'actions',
    ],
    columns: [
      {
        key: 'Recruitment Reason',
        head: 'Recruitment Reason',
        hidden: false,
        value: (record: MY_TASKS_MODELS.MyTicketModel) => {
          return record.category;
        },
        view: {
          width: 5,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            classes: 'flex align-center py-2',
            align: TableCellAligns.start,
          },
        },
      },
      {
        key: 'ticketNumber',
        head: 'Number',
        // sort: {
        //   sortField: 1,
        //   sortType: SSAConfigInst.CRUD_CONFIG.sort.asc,
        //   disableClear: true,
        // },
        hidden: false,
        value: (record: MY_TASKS_MODELS.MyTicketModel) => {
          return record.ticketNumber;
        },
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
        key: 'contactName',
        head: 'Contact',
        hidden: false,
        value: (record: MY_TASKS_MODELS.MyTicketModel) => {
          return record.contactName;
        },
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
        key: 'accountName',
        head: 'Account',
        hidden: false,
        value: (record: MY_TASKS_MODELS.MyTicketModel) => {
          return record.accountName;
        },
        view: {
          width: 5,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
      },
      {
        key: 'status',
        head: 'Status',
        hidden: false,
        value: (record: MY_TASKS_MODELS.MyTicketModel) => {
          return record.status;
        },
        view: {
          width: 5,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
      },
      {
        key: 'role',
        head: 'Role',
        hidden: false,
        value: (record: MY_TASKS_MODELS.MyTicketModel) => {
          return record.role;
        },
        view: {
          width: 5,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
      },
      {
        key: 'requested',
        head: 'Requested',
        hidden: false,
        value: (record: MY_TASKS_MODELS.MyTicketModel) => {
          return record.requested;
        },
        view: {
          width: 5,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
      },
      {
        key: 'started',
        head: 'Started',
        hidden: false,
        value: (record: MY_TASKS_MODELS.MyTicketModel) => {
          return record.started;
        },
        view: {
          width: 5,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
      },
      {
        key: 'hired',
        head: 'Hired',
        hidden: false,
        value: (record: MY_TASKS_MODELS.MyTicketModel) => {
          return record.hired;
        },
        view: {
          width: 5,
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
    // this.user$.subscribe((data) => (this.user = data));
    // console.log('client', this.clientID);
  }

  mapTableAction({
    record,
    action,
  }: {
    record: MY_TASKS_MODELS.MyTicketModel;
    action: TableActionModel;
  }) {
    if (action.key == SSAConfigInst.CRUD_CONFIG.actions.view) {
      this.openResolutionModal(record.resolution);
    }
    // const takeActionParameter: MY_TASKS_MODELS.MyTasksActionTaken = {
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
    // this._store
    //   .dispatch(new MY_TASKS_ACTIONS.TakeActionOnTeam(takeActionParameter))
    //   .subscribe(() => {
    //     this._snackbarService.openSuccessSnackbar({
    //       message:
    //         SSAConfigInst.CRUD_CONFIG.successMessages[successMessage](
    //           'Your Task'
    //         ),
    //       duration: 5,
    //       showCloseBtn: false,
    //     });
    //   });
  }

  public openModal(id: string) {
    let modalData;
    this.myTeams$.subscribe(
      (data) => (modalData = data.filter((record) => record.id === id))
    );
    const dialogRef = this.dialog.open(ModalMyTicketsComponent, {
      width: '700px',
      data: modalData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('The dialog was closed');
    });
  }

  public openResolutionModal(resolution: string) {
    const dialogRef = this.dialog.open(TicketsDetailsComponent, {
      width: '500px',
      data: resolution,
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('The dialog was closed');
    });
  }

  /*_________________________________________ACTIONS TRIGGERS_______________________________________*/

  @Dispatch() public firePaginateMyTeams(pagination: PaginationConfigModel) {
    // console.log('fired pagination', pagination);
    const pagintationForm: PaginationConfigModel = {
      pageSize: pagination.pageSize,
      pageIndex: pagination.pageIndex,
    };
    return new MY_TASKS_ACTIONS.PaginateMyTeams(pagintationForm);
  }
}
