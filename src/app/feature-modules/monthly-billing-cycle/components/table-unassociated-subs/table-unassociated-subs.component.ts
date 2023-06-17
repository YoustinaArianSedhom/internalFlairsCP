import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { MonthlyBillingCyclesState } from '../../state/monthly-billing-cycle.state';
import { Observable } from 'rxjs';
import * as MONTHLY_BILLING_CYCLES_MODELS from '@modules/monthly-billing-cycle/models/monthly-billing-cycle.models';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { TableConfigModel } from '@shared/modules/tables/model/tables.model';
import { TableCellAligns, TableCellTypes } from '@shared/modules/tables/model/tables.config';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import * as MONTHLY_BILLING_CYCLES_ACTIONS from '@modules/monthly-billing-cycle/state/monthly-billing-cycle.actions';
@Component({
  selector: 'customerPortal-table-unassociated-subs',
  templateUrl: './table-unassociated-subs.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class TableUnassociatedSubsComponent {

  @Select(MonthlyBillingCyclesState.unassociatedSubs) public unassociatedSubs$: Observable<MONTHLY_BILLING_CYCLES_MODELS.UnassociatedSubsModel[]>;
  @ViewSelectSnapshot(MonthlyBillingCyclesState.unassociatedSubsPagination) public pagination!: PaginationConfigModel;
  
  public tableConfig: TableConfigModel = {
    actions: [],
    keys: ['resource_name','manager', 'last_associated_date','last_associated_account'],
    columns: [
      {
        key: 'resource_name',
        head: 'Resource name',
        value: (record: MONTHLY_BILLING_CYCLES_MODELS.UnassociatedSubsModel) => record?.name,
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
        key: 'manager',
        head: 'Manager',
        value: (record: MONTHLY_BILLING_CYCLES_MODELS.UnassociatedSubsModel) => record?.manager,
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
        key: 'last_associated_date',
        head: 'Last associated date',
        value: (record: MONTHLY_BILLING_CYCLES_MODELS.UnassociatedSubsModel) => record?.lastAssociatedDate,
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
        type: TableCellTypes.date
      },
      {
        key: 'last_associated_account',
        head: 'Last associated account',
        value: (record: MONTHLY_BILLING_CYCLES_MODELS.UnassociatedSubsModel) => record?.lastAccountName,
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
    ]
  }
  
  constructor() { }

  @Dispatch() paginateUnassociatedSubs(pagination: PaginationConfigModel){ return new MONTHLY_BILLING_CYCLES_ACTIONS.PaginateUnassociatedSubs(pagination) };

}
