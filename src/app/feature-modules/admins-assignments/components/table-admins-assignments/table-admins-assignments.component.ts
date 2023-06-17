import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { AdminsAssignmentsState } from '../../state/admins-assignments.state';
import { Observable } from 'rxjs';
import * as ADMINS_ASSIGNMENTS_MODELS from '@modules/admins-assignments/models/admins-assignments.models';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { TableActionModel, TableConfigModel } from '@shared/modules/tables/model/tables.model';
import { TableCellAligns, TableCellTypes } from '@shared/modules/tables/model/tables.config';
import { TablesService } from '@shared/modules/tables/model/tables.service';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { PaginateSchedules } from './../../state/admins-assignments.actions'
import { ModalsService } from '@shared/modules/modals/model/modals.service';
import * as ADMINS_ASSIGNMENTS_ACTIONS from '@modules/admins-assignments/state/admins-assignments.actions';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
@Component({
  selector: 'customerPortal-table-admins-assignments',
  templateUrl: './table-admins-assignments.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class TableAdminsAssignmentsComponent implements OnInit {

  @Select(AdminsAssignmentsState.schedules) public schedules$: Observable<ADMINS_ASSIGNMENTS_MODELS.adminModel[]>;
  @ViewSelectSnapshot(AdminsAssignmentsState.SchedulesPagination) public pagination: PaginationConfigModel;


  public tableConfig: TableConfigModel = {
    actions: [{
      key: 'unschedule',
      label: 'Delete Assignment',
      icon: {
        name: 'link_off',
        isSVG: false
      }
    }],
    keys: ['external_name', 'external_email', 'internal_name', 'internal_email', 'actions'],
    columns: [
      {
        key: 'external_name',
        head: 'External admin name',
        hidden: false,
        value: (record: ADMINS_ASSIGNMENTS_MODELS.adminModel) => record.clientProfile.fullName,
        view: {
          width: 20,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
      },
      {
        key: 'external_email',
        head: 'External admin email',
        hidden: false,
        value: (record: ADMINS_ASSIGNMENTS_MODELS.adminModel) => record.clientProfile.clientEmail,
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
        key: 'internal_name',
        head: 'Internal admin name',
        hidden: false,
        value: (record: ADMINS_ASSIGNMENTS_MODELS.adminModel) => record.profile.fullName,
        view: {
          width: 20,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
      },
      {
        key: 'internal_email',
        head: 'Internal admin email',
        hidden: false,
        value: (record: ADMINS_ASSIGNMENTS_MODELS.adminModel) => record.profile.organizationEmail,
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
    ]
  }


  constructor(
    private _tableService: TablesService,
    private _modals: ModalsService,
    private _store: Store,
    private _snackbar: SnackBarsService,

  ) { }

  @Dispatch() public firePaginateChange(pagination: PaginationConfigModel) {
    return new PaginateSchedules(pagination)
  }

  ngOnInit(): void {
    this._tableService.setupConfig(this.tableConfig);
  }


  public mapTableAction({ record, action }: { record: ADMINS_ASSIGNMENTS_MODELS.adminModel, action: TableActionModel }) {
    if (action.key === 'unschedule') {
      this._modals.openConfirmationDialog(
        {
          title: 'Delete assignment',
          content: `Are you sure you want to delete the assignment between ${record.clientProfile.fullName} and ${record.profile.fullName} ?`,
          proceedText: 'Delete assignment',
          cancelText: 'Cancel'
        },
        () => {
          this._store.dispatch(new ADMINS_ASSIGNMENTS_ACTIONS.UnscheduleAdmin(record.id)).subscribe(() => {
            this._store.dispatch(new ADMINS_ASSIGNMENTS_ACTIONS.GetSchedules())
            this._snackbar.openSuccessSnackbar({
              message: `Delete assignment has been done successfully`,
              duration: 5,
            });
          })
        }
      );
    }
  }
}
