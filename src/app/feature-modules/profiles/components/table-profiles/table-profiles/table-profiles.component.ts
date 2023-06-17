import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  TableCellAligns,
  TableCellTypes,
} from '@shared/modules/tables/model/tables.config';
import {
  TableActionModel,
  TableConfigModel,
} from '@shared/modules/tables/model/tables.model';
import { SSAConfigInst } from 'src/app/config/app.config';
import * as PROFILE_MODELS from '../../../models/profiles.model';
import * as PROFILE_ACTIONS from '../../../state/profiles.actions';
import { TablesService } from '@shared/modules/tables/model/tables.service';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select, Store } from '@ngxs/store';
import { ProfileState } from '@modules/profiles/state/profiles.state';
import { Observable } from 'rxjs';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { MatDialog } from '@angular/material/dialog';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalEditClientRolesComponent } from '../../modal-edit-profile-roles/modal-edit-profile-roles.component';
import { UserModel } from '@modules/user-management/model/user-management.models';

@Component({
  selector: 'app-table-profiles',
  templateUrl: './table-profiles.component.html',
  styleUrls: ['./table-profiles.component.scss'],
})
export class TableProfilesComponent implements OnInit {

  @Output() OpenModal = new EventEmitter<string>();

  // @Select(UserState.user) public user$: Observable<UserModel>;

  @Select(ProfileState.profiles) public profiles$: Observable<
    PROFILE_MODELS.ProfilesModel[]
  >;
  @ViewSelectSnapshot(ProfileState.paginationConfig)
  public pagination: PaginationConfigModel;

  public user: UserModel;
  public sidePanelData = null;
  public isPanelOpen = false;

  public tableConfig: TableConfigModel = {
    actions: [
    ],
    keys: ['fullName', 'title', 'organizationEmail', 'platform', 'view-details'],
    columns: [
      {
        key: 'fullName',
        head: 'full Name',
        hidden: false,
        value: (record: PROFILE_MODELS.ProfilesModel) => record.fullName,
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            // classes: 'flex align-center py-2',
            align: TableCellAligns.start,
          },
        },
      },
      {
        key: 'title',
        head: 'Title',
        hidden: false,
        value: (record: PROFILE_MODELS.ProfilesModel) => record.title,
        view: {
          width: 15,
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
        key: 'organizationEmail',
        head: 'FlairsTech Email',
        hidden: false,
        value: (record: PROFILE_MODELS.ProfilesModel) => record.organizationEmail,
        view: {
          width: 15,
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
        key: 'platform',
        head: 'Platform',
        hidden: false,
        value: (record: PROFILE_MODELS.ProfilesModel) => record.assignment ? record.assignment.platform.name : 'N/A',
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.center,
          },
          bodyCell: {
            align: TableCellAligns.center,
            classes: (record: PROFILE_MODELS.ProfilesModel) => {
              let baseClass =
                'flex items-center justify-center text-s font-medium text-white px-1  ';
              if (
                record.assignment &&
                record.assignment.platform.name === 'Unallowed Team'
              ) {
                return (baseClass += ' bg-black');
              }
            },
          },
        },
      },
      {
        key: 'view-details',
        head: 'View Details',
        hidden: false,
        value: (record: PROFILE_MODELS.ProfilesModel) => {
          return {
            key: SSAConfigInst.CRUD_CONFIG.actions.view,
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
        type: TableCellTypes.iconButton
      },
    ],
  };

  constructor(
    private _tableService: TablesService,
    private _store: Store,
    private _snackbarService: SnackBarsService,
    private _router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {}

   @Dispatch() public firePaginateMyTeams(pagination: PaginationConfigModel) {
    // console.log('fired pagination', pagination);
    const pagintationForm: PaginationConfigModel = {
      pageSize: pagination.pageSize,
      pageIndex: pagination.pageIndex,
    };
    return new PROFILE_ACTIONS.PaginateMyTeams(pagintationForm);
  }

  @Dispatch() private _fireProfilesTable() {
    return new PROFILE_ACTIONS.getProfiles({});
  }


  /*_______________________________________SETUP TABLE CONFIG_________________________________*/


  /*__________________________________________TABLE INITIATION____________________________________*/

  ngOnInit(): void {
    this._tableService.setupConfig(this.tableConfig);
    this._fireProfilesTable();
    // this.user$.subscribe((data) => (this.user = data));
  }

  mapTableAction({
    record,
    action,
  }: {
    record: PROFILE_MODELS.ProfilesModel;
    action: TableActionModel;
  }) {
    // console.log('pressed', action);
    
    if (action.key === SSAConfigInst.CRUD_CONFIG.actions.update) {
      this.openModal(record);
    } else if (action.key === SSAConfigInst.CRUD_CONFIG.actions.view) {
      this.sidePanelData = record;
      this.isPanelOpen = true;
      // this._router.navigate([`details/${record.id}`], {
      //   relativeTo: this.route,
      // });
    }
    const takeActionParameter: PROFILE_MODELS.MyTasksActionTaken = {
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
  }

  public openModal(profile: PROFILE_MODELS.ProfilesModel) {
    const dialogRef = this.dialog.open(ModalEditClientRolesComponent, {
      width: '400px',
      data: profile,
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('The dialog was closed');
    });
  }

  panelClose() {
    this.isPanelOpen = false;
  }

  /*_________________________________________ACTIONS TRIGGERS_______________________________________*/

}
