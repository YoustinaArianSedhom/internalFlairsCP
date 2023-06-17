import { Component, OnInit } from '@angular/core';
import { MyTeamState } from '@modules/my-team/state/my-team.state';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Select } from '@ngxs/store';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { TableCellAligns } from '@shared/modules/tables/model/tables.config';
import { TableConfigModel } from '@shared/modules/tables/model/tables.model';
import { Observable } from 'rxjs';
import * as MY_TEAM_MODELS from '../../models/my-team.models';
import * as MY_TEAM_ACTIONS from '../../state/my-team.action';
import * as MY_TEAM_CONFIG from '../../models/my-team.config';
@Component({
  selector: 'customerPortal-table-my-team',
  templateUrl: './table-my-team.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class TableMyTeamComponent {
  @Select(MyTeamState.myTeam) public myTeam$: Observable<MY_TEAM_MODELS.MyTeamModel[]>
  @ViewSelectSnapshot(MyTeamState.teamPagination) public pagination!: PaginationConfigModel;

  public tableConfig: TableConfigModel = {
    actions: [],
    keys: ['employee_name', 'title', 'manager', 'current_association_status', 'active_associations'],
    columns: [
      {
        key: 'employee_name',
        head: 'Employee Name',
        value: (record: MY_TEAM_MODELS.MyTeamModel) => record?.fullName,
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
      },
      {
        key: 'title',
        head: 'Title',
        value: (record: MY_TEAM_MODELS.MyTeamModel) => record?.title,
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          }
        }
      },
      {
        key: 'manager',
        head: 'Manager',
        value: (record: MY_TEAM_MODELS.MyTeamModel) => record?.managerFullName,
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
        key: 'current_association_status',
        head: 'Current Association Status',
        value: (record: MY_TEAM_MODELS.MyTeamModel) => MY_TEAM_CONFIG.ASSOSIATION_STATUS[record.currentAssociationStatus],
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
        key: 'active_associations',
        head: 'Active associations',
        value: (record: MY_TEAM_MODELS.MyTeamModel) => record?.associationCount === 0 ? '0' : record?.associationCount,
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        }
      },
    ]
  }
  constructor() { }
  @Dispatch() public paginateMyTeam(pagination: PaginationConfigModel) { return new MY_TEAM_ACTIONS.PaginateMyTeam(pagination) }


}
