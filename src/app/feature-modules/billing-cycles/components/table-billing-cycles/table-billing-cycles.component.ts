import { BillingCyclesState } from '@modules/billing-cycles/state/billing-cycles.state';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { TableActionModel, TableConfigModel } from '@shared/modules/tables/model/tables.model';
import { TableCellAligns, TableCellTypes } from '@shared/modules/tables/model/tables.config';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import * as BILLING_CYCLES_ACTIONS from '@modules/billing-cycles/state/billing-cycles.actions';
import * as BILLING_CYCLES_MODELS from "@modules/billing-cycles/models/billing-cycles.models";
import * as BILLING_CYCLES_CONFIG from '@modules/billing-cycles/models/billing-cycles.config'
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'customerPortal-table-billing-cycles',
  templateUrl: './table-billing-cycles.component.html',
  styles: [
    `
      :host {
        display: block;
      }    
      ::ng-deep .mat-column-name{
        min-width: 15rem !important;
      }
    `
  ],
})
export class TableBillingCyclesComponent {
  @Select(BillingCyclesState.billingCycles) public billingCycles$: Observable<BILLING_CYCLES_MODELS.BillingCycleModel[]>
  @ViewSelectSnapshot(BillingCyclesState.cyclesPagination) public pagination: PaginationConfigModel;
  @ViewSelectSnapshot(BillingCyclesState.showAmount) public showAmount: boolean;


  public tableConfig: TableConfigModel = {
    actions: [],
    keys: ['name', 'month', 'po_number', 'status', 'amount', 'currency', 'po_start_date', 'po_end_date', 'account', 'portfolio', 'platform', 'department', 'manager', 'partner'],
    columns: [
      {
        key: 'name',
        head: 'Name',
        value: (record: BILLING_CYCLES_MODELS.BillingCycleModel) => (
          {
            key: 'view_cycle',
            label: record.name,
          }),
        view: {
          width: 30,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
            classes: (record: BILLING_CYCLES_MODELS.BillingCycleModel)=>{
              let classes = 'underline cursor-pointer text-primary pr-5'
              //adding highlighted-color class to select parent element 'mat-row' to add custom style to the whole row  based on hasShortage
              if(record.hasShortage){
                classes += ' highlighted-color'
              }
              return classes
            },
          },
        },
        type: TableCellTypes.eventEmitter
      },
      {
        key: 'month',
        head: 'Month',
        value: (record: BILLING_CYCLES_MODELS.BillingCycleModel) => { return record.month + '/' + record.year },
        view: {
          width: 5,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
      },
      {
        key: 'po_number',
        head: 'PO Number',
        value: (record: BILLING_CYCLES_MODELS.BillingCycleModel) => {return record.poNumber},
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
        key: 'status',
        head: 'Status',
        value: (record: BILLING_CYCLES_MODELS.BillingCycleModel) => { return record.status === 1 ? 'Closed' : 'Opened' },
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
        key: 'amount',
        head: 'Amount',
        // value: (record: BILLING_CYCLES_MODELS.BillingCycleModel) => { return record.amount ? this._currencyPipe.transform(record?.amount, record?.currency?.code) : 'N/A' },
        value: (record: BILLING_CYCLES_MODELS.BillingCycleModel) => { 
          return !this.showAmount ? `<span color="warn" class="mat-icon notranslate mat-warn material-icons ml-3">lock</span>` : record?.amount ? this._currencyPipe.transform(record?.amount, record?.currency?.code) : 'N/A'},
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
        type: TableCellTypes.html
      },
      {
        key: 'currency',
        head: 'Currency',
        value: (record: BILLING_CYCLES_MODELS.BillingCycleModel) => { return record?.currency?.name },
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
      },
      {
        key: 'po_start_date',
        head: 'PO Start Date',
        value: (record: BILLING_CYCLES_MODELS.BillingCycleModel) => { return record.poStartDate },
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
        key: 'po_end_date',
        head: 'PO End Date',
        value: (record: BILLING_CYCLES_MODELS.BillingCycleModel) => { return record.poEndDate },
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
        key: 'account',
        head: 'Account',
        value: (record: BILLING_CYCLES_MODELS.BillingCycleModel) => { return record?.platform?.portfolio?.account?.name },
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
        key: 'portfolio',
        head: 'Portfolio',
        value: (record: BILLING_CYCLES_MODELS.BillingCycleModel) => { return record?.platform?.portfolio?.name },
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
        key: 'platform',
        head: 'Platform',
        value: (record: BILLING_CYCLES_MODELS.BillingCycleModel) => { return record?.platform?.name },
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
        key: 'department',
        head: 'Department',
        value: (record: BILLING_CYCLES_MODELS.BillingCycleModel) => { return record?.department.name },
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
        key: 'manager',
        head: 'Manager',
        value: (record: BILLING_CYCLES_MODELS.BillingCycleModel) => { return record?.poManagerName },
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
        key: 'partner',
        head: 'Partner',
        value: (record: BILLING_CYCLES_MODELS.BillingCycleModel) => { return record?.poPartnerOwner },
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
    ]
  }

  constructor(private _router: Router, private _currencyPipe:CurrencyPipe) { }

  @Dispatch() public paginationBillingCycle(pagination: PaginationConfigModel) { return new BILLING_CYCLES_ACTIONS.PaginateFilteredPage(pagination) }

  public mapTableActions({ record, action, }: { record: BILLING_CYCLES_MODELS.BillingCycleModel; action: TableActionModel; }) {
    if (action.key === 'view_cycle') {
      this._router.navigate(['/billing/cycle-details', record.id])
    }
  }

}
