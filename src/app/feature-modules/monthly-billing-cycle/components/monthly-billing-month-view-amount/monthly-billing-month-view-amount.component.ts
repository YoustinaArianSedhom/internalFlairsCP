import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as MONTHLY_BILLING_CYCLES_MODELS from "@modules/monthly-billing-cycle/models/monthly-billing-cycle.models";

@Component({
  selector: 'customerPortal-monthly-billing-month-view-amount',
  templateUrl: './monthly-billing-month-view-amount.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class MonthlyBillingMonthViewAmountComponent implements OnInit {
  public title: string = ''
  constructor(@Inject(MAT_DIALOG_DATA) public data:MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleModel) { }

  ngOnInit(): void {
    console.log(this.data);
    this.title = this.data?.month + "-" + this.data?.year
  }

}
