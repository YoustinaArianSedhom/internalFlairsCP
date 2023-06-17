import { MonthlyBillingCyclesState } from '@modules/monthly-billing-cycle/state/monthly-billing-cycle.state';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { TableActionModel, TableConfigModel } from '@shared/modules/tables/model/tables.model';
import { TableCellAligns, TableCellTypes } from '@shared/modules/tables/model/tables.config';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import * as MONTHLY_BILLING_CYCLES_ACTIONS from '@modules/monthly-billing-cycle/state/monthly-billing-cycle.actions';
import * as MONTHLY_BILLING_CYCLES_MODELS from "@modules/monthly-billing-cycle/models/monthly-billing-cycle.models";
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MonthPoDetailsComponent } from '../month-po-details/month-po-details.component';
import { CurrencyPipe } from '@angular/common';
import { MonthlyBillingMonthViewAmountComponent } from '../monthly-billing-month-view-amount/monthly-billing-month-view-amount.component';

@Component({
  selector: 'customerPortal-table-monthly-billing-cycles',
  templateUrl: './table-monthly-billing-cycles.component.html',
  styles: [
    `
        :host {
          display: block;
        }    
      `
  ],
})

export class TableMonthlyBillingCyclesComponent {
  @Select(MonthlyBillingCyclesState.monthlyBillingCycles) public monthlyBillingCycles$: Observable<MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleModel[]>
  @ViewSelectSnapshot(MonthlyBillingCyclesState.monthlyBillingPagination) public pagination: PaginationConfigModel;

  public tableConfig: TableConfigModel = {
    actions: [],
    keys: ['month_year', 'status', 'amount', 'billable_associations_count','nonBillable_associations_count', 'purchase_orders'],
    columns: [
      {
        key: 'month_year',
        head: 'Month-Year',
        value: (record: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleModel) => (
          {
            key: 'view_cycle',
            label: record.month + '/' + record.year,
          }),
        view: {
          width: 9,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
            classes: 'underline cursor-pointer text-primary pr-5',
          },
        },
        type: TableCellTypes.eventEmitter,
      },
      {
        key: 'status',
        head: 'Status',
        value: (record: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleModel) => {
          let value = '';
          record.status.map((item) => value += item.status === 0 ? item.count + ' Opened' :
            (record?.status?.length > 1 && ', ') + item.count + ' Closed')
          return value;
        },
        view: {
          width: 9,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        }
      },
      {
        key: 'amount',
        head: 'Amount',
        value: (record: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleModel) => { return {key: 'view_amount',label: record?.amount.length > 1 ? 'Multiple': this._currencyPipe.transform(record?.amount[0]?.amount ? record?.amount[0]?.amount : '0', record?.amount[0]?.currency?.code) }},
        view: {
          width: 9,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
            classes: 'underline cursor-pointer text-primary pr-5'
          },
        },
        type: TableCellTypes.eventEmitter
      },
      {
        key: 'billable_associations_count',
        head: 'Billable associations count',
        value: (record: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleModel) => { return record?.billableAssociationCount },
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
      {
        key: 'nonBillable_associations_count',
        head: 'Nonbillable associations count',
        value: (record: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleModel) => { return record?.nonBillableAssociationCount },
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
      {
        key: 'purchase_orders',
        head: 'Purchase orders',
        value: (record: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleModel) => ({
          key: record?.pOs?.length > 1 ? 'view_po' : '',
          label: record?.pOs?.length > 1 ? 'Purchase orders' : record?.pOs[0]?.number,

        }),
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
            classes: (record: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleModel) => {
              let baseClass = 'underline cursor-pointer text-primary pr-5';
              if (record?.pOs?.length > 1) {
                return (baseClass);
              }
            }
          },
        },
        type: TableCellTypes.eventEmitter,
      },
    ]
  }


  constructor(private _router: Router, private _dialog: MatDialog , private _currencyPipe:CurrencyPipe) { }

  @Dispatch() public paginationMonthlyBillingCycle(pagination: PaginationConfigModel) { return new MONTHLY_BILLING_CYCLES_ACTIONS.PaginateMonthlyBillingCycles(pagination) }

  public mapTableActions({ record, action, }: { record: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleModel; action: TableActionModel; }) {
    if (action.key === 'view_cycle') {
      this._router.navigate(['/monthly-billing-cycle/monthly-cycle-details', record.month, record.year])
    }
    else if (action.key === 'view_po') {
      this._dialog.open(MonthPoDetailsComponent, {
        maxWidth: '75%',
        data: record
      });
    }
    else if(action.key === 'view_amount'){
      this._dialog.open(MonthlyBillingMonthViewAmountComponent,{
        panelClass: ['form-dialog--medium'],
        data: record
      })
    }
  }

}

