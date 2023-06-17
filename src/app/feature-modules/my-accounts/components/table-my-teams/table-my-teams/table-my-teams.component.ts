import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
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
import * as MY_TASKS_MODELS from '../../../models/my-accounts.model';
import * as MY_TASKS_CONFIGS from '../../../models/my-accounts.config';
import * as MY_TASKS_ACTIONS from '../../../state/my-accounts.actions';
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
import { MyTeamModel, RequestTeamModel } from '../../../models/my-accounts.model';
import { UserState } from '@core/modules/user/state/user.state';
import { ModalMyTeamsComponent } from '../../modal-my-teams/modal-my-teams.component';
import { UserModel } from '@modules/user-management/model/user-management.models';

@Component({
  selector: 'ssa-table-my-teams',
  templateUrl: './table-my-teams.component.html',
  styleUrls: ['./table-my-teams.component.scss'],
})
export class TableMyTeamsComponent implements OnInit {
  constructor(
    private _tableService: TablesService,
    private _store: Store,
    private _snackbarService: SnackBarsService,
    private _router: Router,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  public user: UserModel;

  @Input() clientID;
  teamsIDS;
  public isPanelOpen: boolean = false;
  public sidePanelData = null;
  status = MY_TASKS_CONFIGS.status;

  @Output() OpenModal = new EventEmitter<string>();

  // @Select(UserState.user) public user$: Observable<UserModel>;

  @Select(MyTeamsState.myTeams) public myTeams$: Observable<
    MY_TASKS_MODELS.MyTeamModel[]
  >;
  @ViewSelectSnapshot(MyTeamsState.paginationConfig)
  public pagination: PaginationConfigModel;

  @Select(MyTeamsState.teams)
  public teams$: Observable<MY_TASKS_MODELS.AssignedPortfolios>;

  /*_______________________________________SETUP TABLE CONFIG_________________________________*/
  public tableConfig: TableConfigModel = {
    actions: [
      {
        key: SSAConfigInst.CRUD_CONFIG.actions.approve,
        label: SSAConfigInst.CRUD_CONFIG.actions.approve,
        icon: {
          name: 'done',
          isSVG: false,
        },
        hideCondition: (record: MY_TASKS_MODELS.MyTeamModel) => {
          return true;
        },
      },
      {
        key: SSAConfigInst.CRUD_CONFIG.actions.reject,
        label: SSAConfigInst.CRUD_CONFIG.actions.reject,
        icon: {
          name: 'clear',
          isSVG: false,
        },
        hideCondition: (record: MY_TASKS_MODELS.MyTeamModel) => {
          return true;
        },
        // hideCondition: (record: MY_TASKS_MODELS.MyTeamModel) => {
        //   return !record.availableChoices?.includes('REJECT');
        // },
      },
      {
        key: SSAConfigInst.CRUD_CONFIG.actions.apply,
        label: SSAConfigInst.CRUD_CONFIG.actions.apply,
        icon: {
          name: 'done_all',
          isSVG: false,
        },
        hideCondition: (record: MY_TASKS_MODELS.MyTeamModel) => {
          return true;
        },
        // hideCondition: (record: MY_TASKS_MODELS.MyTeamModel) => {
        //   return !record.availableChoices?.includes('APPLY');
        // },
      },
      {
        key: SSAConfigInst.CRUD_CONFIG.actions.view,
        label: SSAConfigInst.CRUD_CONFIG.actions.view + ' Details',
        icon: {
          name: 'visibility',
        },
        hideCondition: (record: MY_TASKS_MODELS.MyTeamModel) => {
          return false;
        },
      },
    ],
    keys: [
      'fullName',
      'title',
      'platform',
      'billingRate',
      'service start date',
      'status',
      'view-details',
    ],
    columns: [
      {
        key: 'fullName',
        head: 'Full Name',
        hidden: false,
        value: (record: MY_TASKS_MODELS.MyTeamModel) => {
          return record.fullName;
        },
        view: {
          width: 15,
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
        key: 'title',
        head: 'Title',
        hidden: false,
        value: (record: MY_TASKS_MODELS.MyTeamModel) => {
          return record.title;
        },
        view: {
          width: 20,
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
        key: 'platform',
        head: 'Platform',
        hidden: false,
        value: (record: MY_TASKS_MODELS.MyTeamModel) => {
          return record.platform.name;
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
        key: 'billingRate',
        head: 'Billing Rate',
        hidden: false,
        value: (record: MY_TASKS_MODELS.MyTeamModel) => {
          return record.billingRate;
        },
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.center,
          },
          bodyCell: {
            align: TableCellAligns.center,
          },
        },
        type: TableCellTypes.currency,
      },
      {
        key: 'service start date',
        head: 'Service Start Date',
        hidden: false,
        value: (record: MY_TASKS_MODELS.MyTeamModel) => {
          return record.serviceStartDate;
        },
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.center,
          },
          bodyCell: {
            align: TableCellAligns.center,
          },
        },
        type: TableCellTypes.date,
      },
      {
        key: 'status',
        head: 'Status',
        hidden: false,
        value: (record: MY_TASKS_MODELS.MyTeamModel) => {
          const statusIndex = MY_TASKS_CONFIGS.TEAMS_STATUS_OPTIONS.findIndex(
            (status) => status.id === +record.status
          );
          return MY_TASKS_CONFIGS.TEAMS_STATUS_OPTIONS[statusIndex].name;
        },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.center,
          },
          bodyCell: {
            align: TableCellAligns.center,
            classes: (record: MY_TASKS_MODELS.MyTeamModel) => {
              const statusIndex =
                MY_TASKS_CONFIGS.TEAMS_STATUS_OPTIONS.findIndex(
                  (status) => status.id === +record.status
                );
              const status =
                MY_TASKS_CONFIGS.TEAMS_STATUS_OPTIONS[statusIndex].name;
              let baseClass =
                'flex items-center justify-center text-s font-medium text-white px-1 rounded ';
              if (status === 'Active') {
                return (baseClass += ' bg-green-500');
              } else if (status === 'Inactive') {
                return (baseClass += ' bg-red-500');
              } else {
                return (baseClass += ' bg-yellow-500');
              }
            },
          },
        },
      },
      {
        key: 'view-details',
        head: 'View Details',
        hidden: false,
        value: (record: MY_TASKS_MODELS.MyTeamModel) => {
          return {
            key: 'view',
            icon: 'visibility',
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
        type: TableCellTypes.iconButton,
      },
    ],
  };

  /*__________________________________________TABLE INITIATION____________________________________*/

  ngOnInit(): void {
    this._tableService.setupConfig(this.tableConfig);
    this.route.params.subscribe((params: Params) => {
      this.panelClose();
    });
  }

  panelClose() {
    this.isPanelOpen = false;
  }

  mapTableAction({
    record,
    action,
  }: {
    record: MY_TASKS_MODELS.MyTeamModel;
    action: TableActionModel;
  }) {
    if (action.key == 'view') {
      // this.openModal(record.id);
      this.sidePanelData = record;
      console.log(this.sidePanelData);
      this.isPanelOpen = true;
    }
    const takeActionParameter: MY_TASKS_MODELS.MyTasksActionTaken = {
      requestId: record.id,
      choice: action.key.toUpperCase(),
    };
    let successMessage;
    switch (action.key) {
      case 'Approve':
        successMessage = 'approved';
        break;
      case 'Apply':
        successMessage = 'applied';
        break;
      case 'Reject':
        successMessage = 'rejected';
        break;
      default:
        return (successMessage = null);
    }

    this._store
      .dispatch(new MY_TASKS_ACTIONS.TakeActionOnTeam(takeActionParameter))
      .subscribe(() => {
        this._snackbarService.openSuccessSnackbar({
          message:
            SSAConfigInst.CRUD_CONFIG.successMessages[successMessage](
              'Your Task'
            ),
          duration: 5,
          showCloseBtn: false,
        });
      });
  }

  public openModal(id: string) {
    let modalData;
    this.myTeams$.subscribe(
      (data) => (modalData = data.filter((record) => record.id === id))
    );
    const dialogRef = this.dialog.open(ModalMyTeamsComponent, {
      width: '700px',
      data: modalData,
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
  @Dispatch() public fireSortTeamsAction(sort: TableColumnSortModel) {
    return new MY_TASKS_ACTIONS.SortMyTeams(sort);
  }
}
