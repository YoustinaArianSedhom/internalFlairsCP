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
import { ModalMyTeamsComponent } from '@modules/my-accounts/components/modal-my-teams/modal-my-teams.component';
import { ModalDeleteTeamComponent } from '../../modal-delete-team/modal-delete-team.component';
import { ModalAddTeamComponent } from '../../modal-add-team/modal-add-team.component';
import { UserModel } from '@modules/user-management/model/user-management.models';

@Component({
  selector: 'ssa-table-teams',
  templateUrl: './table-teams.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class TableTeamsComponent implements OnInit {
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

  @Select(OrganizationState.Teams) public Teams$: Observable<
    ORGANIZATION_MODELS.Teams[]
  >;

  @ViewSelectSnapshot(OrganizationState.SelectedPortfolio)
  public SelectedPortfolio: ORGANIZATION_MODELS.Portfolios;

  @ViewSelectSnapshot(OrganizationState.SelectedClient)
  public client: ORGANIZATION_MODELS.Client;

  @ViewSelectSnapshot(OrganizationState.SelectedPortfolio)
  public portfolio: ORGANIZATION_MODELS.Portfolios;

  @ViewSelectSnapshot(OrganizationState.teamPaginationConfig)
  public pagination: PaginationConfigModel;

  @ViewSelectSnapshot(OrganizationState.SelectedClient)
  public SelectedClient: ORGANIZATION_MODELS.Client;

  /*_______________________________________SETUP TABLE CONFIG_________________________________*/
  public tableConfig: TableConfigModel = {
    actions: [
      // {
      //   key: SSAConfigInst.CRUD_CONFIG.actions.view,
      //   label: 'View Team Members',
      //   hideCondition: (record: ORGANIZATION_MODELS.Teams) => {
      //     return false;
      //   },
      // },
      {
        key: SSAConfigInst.CRUD_CONFIG.actions.update,
        label: 'Edit Platform',
        icon: {
          name: 'edit',
        },
        hideCondition: (record: ORGANIZATION_MODELS.Teams) => {
          return false;
        },
      },
      {
        key: SSAConfigInst.CRUD_CONFIG.actions.delete,
        label: 'Delete Platform',
        icon: {
          name: 'delete',
        },
        hideCondition: (record: ORGANIZATION_MODELS.Teams) => {
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
        value: (record: ORGANIZATION_MODELS.Teams) => {
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
        value: (record: ORGANIZATION_MODELS.Teams) => {
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
        value: (record: ORGANIZATION_MODELS.Teams) => {
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
    let portfolioID = this.route.snapshot.params['portfolioID'];
    this._fireGetTeamsByPortfolioId(portfolioID);
    if (!this.SelectedClient) {
      this._getAndSetPortfolioById(portfolioID);
    }
    this._tableService.setupConfig(this.tableConfig);
  }

  mapTableAction({
    record,
    action,
  }: {
    record: ORGANIZATION_MODELS.Teams;
    action: TableActionModel;
  }) {
    // console.log('pressed', action);
    if (action.key == SSAConfigInst.CRUD_CONFIG.actions.view) {
      this._changeTableMode();
      this._fireGetAssignedProfilesByTeam(record.id);
      this._setSelectedTeam(record.id);
    }
    if (action.key == 'name') {
      this._router.navigate([`/organization/departments/${record.id}`]);
      this._setSelectedTeam(record);
    }
    if (action.key == SSAConfigInst.CRUD_CONFIG.actions.update) {
      this.openEditTeamModal(record, this.client, this.portfolio);
    } else if (action.key == SSAConfigInst.CRUD_CONFIG.actions.delete) {
      this.openDeleteTeamModal(record);
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

  openEditTeamModal(
    team: ORGANIZATION_MODELS.Teams,
    client: ORGANIZATION_MODELS.Client,
    portfolio: ORGANIZATION_MODELS.Portfolios
  ) {
    let modalData = {
      client,
      portfolio,
      edit: {
        team,
      },
    };
    const dialogRef = this.dialog.open(ModalAddTeamComponent, {
      width: '700px',
      data: modalData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('The dialog was closed');
    });
  }

  openDeleteTeamModal(record) {
    const dialogRef = this.dialog.open(ModalDeleteTeamComponent, {
      width: '500px',
      data: record,
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  @Dispatch() private _fireGetTeamsByPortfolioId(id) {
    let filters: ORGANIZATION_MODELS.Filtration;
    filters = {
      portfolioId: id,
    };
    return new ORGANIZATION_ACTIONS.getTeams(filters);
  }

  @Dispatch() private _getAndSetPortfolioById(id) {
    return new ORGANIZATION_ACTIONS.getAndSetPortfolioById(id);
  }

  @Dispatch() private _changeTableMode() {
    return new ORGANIZATION_ACTIONS.changeTableMode(3);
  }

  @Dispatch() private _setSelectedTeam(id) {
    return new ORGANIZATION_ACTIONS.setTeamSelected(id);
  }

  /*_________________________________________ACTIONS TRIGGERS_______________________________________*/

  @Dispatch() public firePaginateMyTeams(pagination: PaginationConfigModel) {
    // console.log('fired pagination', pagination);
    const pagintationForm: PaginationConfigModel = {
      pageSize: pagination.pageSize,
      pageIndex: pagination.pageIndex,
    };
    return [
      new ORGANIZATION_ACTIONS.setFilters({
        portfolioId: this.SelectedPortfolio.id,
      }),
      new ORGANIZATION_ACTIONS.PaginateTeams(pagintationForm),
    ];
  }

  @Dispatch() private _fireGetAssignedProfilesByTeam(id) {
    let filters: ORGANIZATION_MODELS.Filtration;
    filters = {
      teamId: id,
    };
    return new ORGANIZATION_ACTIONS.getAssignedProfilesByTeam(filters);
  }
}
