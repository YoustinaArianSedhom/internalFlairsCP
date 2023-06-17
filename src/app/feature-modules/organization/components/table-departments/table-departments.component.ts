import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizationState } from '@modules/organization/state/organization.state';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Select, Store } from '@ngxs/store';
import { TableCellAligns, TableCellTypes } from '@shared/modules/tables/model/tables.config';
import { TableActionModel, TableConfigModel } from '@shared/modules/tables/model/tables.model';
import { TablesService } from '@shared/modules/tables/model/tables.service';
import { Observable } from 'rxjs';
import * as ORGANIZATION_MODELS from '../../models/clients.models';
import * as ORGANIZATION_ACTIONS from '../../state/organization.actions';

@Component({
  selector: 'customerPortal-table-departments',
  templateUrl: './table-departments.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class TableDepartmentsComponent implements OnInit {

  @Select(OrganizationState.Departments) public records$: Observable<
    ORGANIZATION_MODELS.Department[]
  >;

  @ViewSelectSnapshot(OrganizationState.SelectedPortfolio)
  public SelectedPortfolio: ORGANIZATION_MODELS.Portfolios;

  @ViewSelectSnapshot(OrganizationState.SelectedClient)
  public SelectedClient: ORGANIZATION_MODELS.Client;

  @ViewSelectSnapshot(OrganizationState.SelectedTeam)
  public SelectedTeam: ORGANIZATION_MODELS.Teams;

    /*_______________________________________SETUP TABLE CONFIG_________________________________*/
    public tableConfig: TableConfigModel = {
      actions:[],
      keys: ['name'],
      columns: [
        {
          key: 'name',
          head: 'Name',
          hidden: false,
          value: (record: ORGANIZATION_MODELS.Department) => {
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
              align: TableCellAligns.start,
              classes: 'underline cursor-pointer text-primary',
            },
          },
          type: TableCellTypes.eventEmitter,
        },
      ],
    };

  constructor(
    private _tableService: TablesService,
    private _router: Router,
    private route: ActivatedRoute,
  ) { }


  @Dispatch() private _fireGetDepartments() {
    return new ORGANIZATION_ACTIONS.getDepartments();
  }

  @Dispatch() private _setSelectedDepartment(record) {
    return new ORGANIZATION_ACTIONS.setDepartmentSelected(record);
  }

  @Dispatch() private _getAndSetDepartmentById(id) {
    return new ORGANIZATION_ACTIONS.getAndSetDepartmentById(id);
  }



  /*__________________________________________TABLE INITIATION____________________________________*/

  ngOnInit(): void {
    let departmentID = this.route.snapshot.params['departmentID'];
    // this._fireGetDepartments();
    // if (!this.SelectedClient) {
      this._getAndSetDepartmentById(departmentID);
    // }
    this._tableService.setupConfig(this.tableConfig);
  }

  mapTableAction({
    record,
    action,
  }: {
    record: ORGANIZATION_MODELS.Department;
    action: TableActionModel;
  }) {
    if (action.key === 'name') {
      this._router.navigate([`/organization/profiles/${this.SelectedTeam.id}/${record.id}`]);
      this._setSelectedDepartment(record);
    }

   }


}
