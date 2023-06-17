import { Component, OnInit } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import * as MONTHLY_BILLING_ACTIONS from '@modules/monthly-billing-cycle/state/monthly-billing-cycle.actions'
import { HeadRefresherService } from '@core/services/head-refresher/head-refresher.service';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'customerPortal-manage-monthly-billing-cycle-page',
  templateUrl: './manage-monthly-billing-cycle-page.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class ManageMonthlyBillingCyclePageComponent implements OnInit {
  public headInformation = {
    title: 'Monthly Billing Cycle',
  };
  public  isMobile: boolean;

  constructor(
    private _headRefresher: HeadRefresherService,
    private _breakpointsObserver: BreakpointObserver,
) { }
  @Dispatch() public GetMonthlyBillingCycles() { return new MONTHLY_BILLING_ACTIONS.GetMonthlyBillingCycles() }
  @Dispatch() public exportAsExcel() { return new MONTHLY_BILLING_ACTIONS.ExportMonthlyBillingCyclesAsExcel()}

  ngOnInit(): void {
    this.isMobile = this._breakpointsObserver.isMatched('(max-width: 768px)');
    this.refreshHeadInformation();
    this.GetMonthlyBillingCycles();
  }
    public refreshHeadInformation(): void {
    this._headRefresher.refresh(this.headInformation);
  }

}
