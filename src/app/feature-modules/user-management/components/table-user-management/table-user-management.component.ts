import { Component, OnInit } from '@angular/core';
import * as USER_MANAGEMENT_ACTIONS from '@modules/user-management/state/user-management.actions';
import * as USER_MANAGEMENT_MODELS from '@modules/user-management/model/user-management.models';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { TableActionModel, TableConfigModel } from '@shared/modules/tables/model/tables.model';
import { TablesService } from '@shared/modules/tables/model/tables.service';
import { SSAConfigInst } from 'src/app/config/app.config';
import { TableCellAligns, TableCellTypes } from '@shared/modules/tables/model/tables.config';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { UserManagementState } from '@modules/user-management/state/user-management.state';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { MatDialog } from '@angular/material/dialog';
import { UserRolesFormComponent } from '../user-roles-form/user-roles-form.component';

@Component({
  selector: 'ssa-table-user-management',
  templateUrl: './table-user-management.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class TableUserManagementComponent implements OnInit {

  constructor(
    private _tablesService: TablesService,
    private _matDialog: MatDialog) { }





  /* ___________________ SELECTS _____________________ */
  @ViewSelectSnapshot(UserManagementState.users) public users!: USER_MANAGEMENT_MODELS.UserModel[];
  @Select(UserManagementState.users) public users$!: Observable<USER_MANAGEMENT_MODELS.UserModel[]>;
  @ViewSelectSnapshot(UserManagementState.pagination) public pagination!: PaginationConfigModel;




  public tableConfig: TableConfigModel = {
    actions: [{
      key: SSAConfigInst.CRUD_CONFIG.actions.update,
      label: SSAConfigInst.CRUD_CONFIG.actions.update + ' permissions',
      icon: {
        name: 'rule',
        isSVG: false
      }
    }, 
    // {
    //   key: 'none',
    //   label: 'No Actions',
    //   hideCondition(record: USER_MANAGEMENT_MODELS.UserModel) { return record.status != EmployeeStatusesEnum.archived },
    //   disableCondition(record) {return true}
    // }
    ],
    keys: ['name', 'title', 'email', 'manager', 'created_date', 'actions'],
    columns: [
      {
        key: 'name',
        head: 'name',
        hidden: false,
        value: (record: USER_MANAGEMENT_MODELS.UserModel) => {  return record.fullName },
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          },
        }
      }, {
        key: 'title',
        head: 'title',
        hidden: false,
        value: (record: USER_MANAGEMENT_MODELS.UserModel) => { return record.title },
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start
          }
        }
      }, {
        key: 'email',
        head: 'email',
        hidden: false,
        value: (record: USER_MANAGEMENT_MODELS.UserModel) => { return record.organizationEmail },
        view: {
          width: 25,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          }
        },
        type: TableCellTypes.email
      }, {
        key: 'manager',
        head: 'Manager',
        hidden: false,
        type: TableCellTypes.status,
        value: (record: USER_MANAGEMENT_MODELS.UserModel) => { return record?.manager?.fullName ?? 'N/A' },
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start,
          }
        }
      }, {
        key: 'created_date',
        head: 'create date',
        hidden: false,
        value: (record: USER_MANAGEMENT_MODELS.UserModel) => { return record.createdDate },
        view: {
          width: 5,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start
          }
        },
        type: TableCellTypes.date
      }
    ]
  }

  ngOnInit(): void {
    this._fireGetUsersAction();
    this._tablesService.setupConfig(this.tableConfig);
  }




  public mapTableAction({ record, action }: { record: USER_MANAGEMENT_MODELS.UserModel, action: TableActionModel }) {
    if (action.key == SSAConfigInst.CRUD_CONFIG.actions.update) this.openEmployeeRolesForm(record);
  }


  public openEmployeeRolesForm(record: USER_MANAGEMENT_MODELS.UserModel) {
    this._matDialog.open(UserRolesFormComponent, {
      data: record,
    })
  }



  /* _____________________ Actions Fires ________________________*/
  @Dispatch() private _fireGetUsersAction() { return new USER_MANAGEMENT_ACTIONS.GetUsers() }
  @Dispatch() public firePaginateUsersAction(pagination: PaginationConfigModel) { return new USER_MANAGEMENT_ACTIONS.PaginateUsers(pagination) }
}
