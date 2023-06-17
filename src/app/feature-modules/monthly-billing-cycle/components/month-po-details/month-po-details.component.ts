import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as MONTHLY_BILLING_CYCLES_MODELS from "@modules/monthly-billing-cycle/models/monthly-billing-cycle.models";
import { TableCellAligns } from '@shared/modules/tables/model/tables.config';
import { TableConfigModel } from '@shared/modules/tables/model/tables.model';
import { Observable, of } from 'rxjs';
import { TableCellTypes } from '@shared/modules/tables/model/tables.config';

@Component({
  selector: 'customerPortal-month-po-details',
  templateUrl: './month-po-details.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class MonthPoDetailsComponent implements OnInit {
  public monthPOS$: Observable<MONTHLY_BILLING_CYCLES_MODELS.PO[]>;
  public tableConfig: TableConfigModel = {
    actions: [],
    keys: ['number', 'po_start_date', 'po_end_date', 'po_total_amount'],
    columns: [{
      key: 'number',
      head: 'Purchase order number',
      value: (record: MONTHLY_BILLING_CYCLES_MODELS.PO) => record.number,
      view: {
        width: 30,
        headCell: {
          align: TableCellAligns.start,
        },
        bodyCell: {
          align: TableCellAligns.start,
        },
      }
    },
    {
      key: 'po_start_date',
      head: 'PO start date',
      value: (record: MONTHLY_BILLING_CYCLES_MODELS.PO) => record.startDate,
      view: {
        width: 15,
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
      head: 'PO end date',
      value: (record: MONTHLY_BILLING_CYCLES_MODELS.PO) => record.endDate,
      view: {
        width: 15,
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
      key: 'po_total_amount',
      head: 'PO Total amount',
      value: (record: MONTHLY_BILLING_CYCLES_MODELS.PO) => record?.amount,
      extraInfoValue(record: MONTHLY_BILLING_CYCLES_MODELS.PO) {
        return record?.currency?.code
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
      type: TableCellTypes.currency
    },
    ]
  }
  constructor(@Inject(MAT_DIALOG_DATA) public data: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleModel) { }


  ngOnInit(): void {
    this.monthPOS$ = of(this.data?.pOs)
  }



}
