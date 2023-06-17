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
import * as ORGANIZATION_MODELS from '../../models/clients.models';
import * as ORGANIZATION_CONFIGS from '../../models/clients.config';
import * as ORGANIZATION_ACTIONS from '../../state/organization.actions';
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
import { ModalDeletePortfolioComponent } from '../modal-delete-portfolio/modal-delete-portfolio.component';
import { ModalEditPortfolioComponent } from '../modal-edit-portfolio/modal-edit-portfolio.component';
import { UserModel } from '@modules/user-management/model/user-management.models';

@Component({
  selector: 'customerPortal-table-profiles',
  templateUrl: './table-profiles.component.html',
  styleUrls: ['./table-profiles.component.scss'],
})
export class TableProfilesComponent implements OnInit {
  constructor(
    private _tableService: TablesService,
    private _store: Store,
    private _snackbarService: SnackBarsService,
    private _router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  public user: UserModel;
  public status = ORGANIZATION_CONFIGS.status;
  public isPanelOpen: boolean = false;
  public sidePanelData = null;
  public contractTypes = ['Billable', 'Complementary', 'Time and Materials'];

  // @Input() clientID;
  @Output() OpenModal = new EventEmitter<string>();

  // @Select(UserState.user) public user$: Observable<UserModel>;

  @Select(OrganizationState.AssignedProfiles)
  public AssignedProfiles$: Observable<ORGANIZATION_MODELS.Portfolios[]>;

  @ViewSelectSnapshot(OrganizationState.assignedprofilePaginationConfig)
  public pagination: PaginationConfigModel;

  @ViewSelectSnapshot(OrganizationState.SelectedClient)
  public SelectedClient: ORGANIZATION_MODELS.Client;

  /*_______________________________________SETUP TABLE CONFIG_________________________________*/
  public tableConfig: TableConfigModel = {
    actions: [
      {
        key: SSAConfigInst.CRUD_CONFIG.actions.update,
        label: 'Edit Portfolio',
        icon: {
          name: 'edit',
        },
        hideCondition: (record: ORGANIZATION_MODELS.AssignedProfile) => {
          return false;
        },
      },
      {
        key: SSAConfigInst.CRUD_CONFIG.actions.delete,
        label: 'Delete Portfolio',
        icon: {
          name: 'delete',
        },
        hideCondition: (record: ORGANIZATION_MODELS.AssignedProfile) => {
          return false;
        },
      },
    ],
    keys: ['name', 'role', 'mail', 'status'],
    columns: [
      {
        key: 'name',
        head: 'Name',
        hidden: false,
        value: (record: ORGANIZATION_MODELS.AssignedProfile) => {
          return {
            key: 'name',
            label: record.fullName,
          };
        },
        view: {
          width: 20,
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
        key: 'role',
        head: 'Title',
        hidden: false,
        value: (record: ORGANIZATION_MODELS.AssignedProfile) => {
          return record.title;
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
        key: 'mail',
        head: 'FlairsTech Mail',
        hidden: false,
        value: (record: ORGANIZATION_MODELS.AssignedProfile) => {
          return record.profile.organizationEmail;
        },
        view: {
          width: 20,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
        type: TableCellTypes.email,
      },
      {
        key: 'status',
        head: 'Status',
        hidden: false,
        value: (record: ORGANIZATION_MODELS.AssignedProfile) => {
          return ORGANIZATION_CONFIGS.status[record.status];
        },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.center,
          },
          bodyCell: {
            align: TableCellAligns.center,
            classes: (record: ORGANIZATION_MODELS.AssignedProfile) => {
              let baseClass =
                'flex items-center justify-center text-s font-medium text-white px-1 rounded ';
              if (ORGANIZATION_CONFIGS.status[record.status] === 'Active') {
                return (baseClass += ' bg-green-500');
              } else if (
                ORGANIZATION_CONFIGS.status[record.status] === 'Inactive'
              ) {
                return (baseClass += ' bg-red-500');
              } else {
                return (baseClass += ' bg-yellow-500');
              }
            },
          },
        },
      },
    ],
  };

  /*__________________________________________TABLE INITIATION____________________________________*/

  ngOnInit(): void {
    let teamID = this.route.snapshot.params['teamID'];
    let departmentID = +this.route.snapshot.params['departmentID'];
    this._fireGetAssignedProfilesByTeam(teamID, departmentID);
    // if (!this.SelectedClient) {
    //   this._getAssignedProfilesById(portfolioID);
    // }
    this._tableService.setupConfig(this.tableConfig);
    // this._fireClientsable();
    // this._fireGetEntities();
  }

  panelClose() {
    this.isPanelOpen = false;
  }

  mapTableAction({
    record,
    action,
  }: {
    record: ORGANIZATION_MODELS.AssignedProfile;
    action: TableActionModel;
  }) {
    if (action.key == 'name') {
      // this._router.navigate([`/profiles/details/${record.profile.id}`]);
      this.sidePanelData = record;
      this.isPanelOpen = true;
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
    const dialogRef = this.dialog.open(ModalEditPortfolioComponent, {
      width: '650px',
      data: client,
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('The dialog was closed');
    });
  }

  openDeletePortfolioModal(id: string) {
    const dialogRef = this.dialog.open(ModalDeletePortfolioComponent, {
      width: '500px',
      data: id,
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  /*_________________________________________ACTIONS TRIGGERS_______________________________________*/

  @Dispatch() private _getAssignedProfilesById(id) {
    return new ORGANIZATION_ACTIONS.getAssignedProfilesById(id);
  }

  @Dispatch() private _fireGetAssignedProfilesByTeam(id, departmentID) {
    let filters: ORGANIZATION_MODELS.Filtration;
    filters = {
      PlatformsIds: [id],
      department: departmentID,
    };
    return new ORGANIZATION_ACTIONS.getAssignedProfilesByTeam(filters);
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
