import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeadRefresherService } from '@core/services/head-refresher/head-refresher.service';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { MonthlyBillingCyclesState } from '../../state/monthly-billing-cycle.state';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import * as MONTHLY_BILLING_CYCLES_MODELS from '@modules/monthly-billing-cycle/models/monthly-billing-cycle.models';
import * as MONTHLY_BILLING_ACTIONS from '@modules/monthly-billing-cycle/state/monthly-billing-cycle.actions';

@Component({
  selector: 'customerPortal-manage-view-unassociated-subs-page',
  templateUrl: './manage-view-unassociated-subs-page.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class ManageViewUnassociatedSubsPageComponent implements OnInit {

  @ViewSelectSnapshot(MonthlyBillingCyclesState.unassociatedSubsSearchQuery) public searchQuery: string;
  public headInformation = {
    title : 'Unassociated resources of ' + this._route.snapshot.params.month + '/' + this._route.snapshot.params.year
  }
  public  isMobile: boolean;
  public resetSearch = false;

  constructor(
    private  _route : ActivatedRoute,
    private _headRefresher : HeadRefresherService,
    private _breakpointsObserver: BreakpointObserver,
  ) { }

  @Dispatch() private _fireFilterUnassociatedSubs( filtration: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleDetailsFiltrationModel) { return new MONTHLY_BILLING_ACTIONS.FilterUnassociatedSubs(filtration) };

  ngOnInit(): void {
    this.isMobile = this._breakpointsObserver.isMatched('(max-width: 768px)');
    this.refreshHeadInformation();
    let filtration: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleDetailsFiltrationModel = {
      month: +this._route.snapshot.params.month,
      year: +this._route.snapshot.params.year,
    }
    this._fireFilterUnassociatedSubs(filtration)
  }

  public refreshHeadInformation(): void {
    this._headRefresher.refresh(this.headInformation);
  }

  
  public resetFilter(){
    this.resetSearch = !this.resetSearch;
    this.onSearchChange('')
  }

  public onSearchChange(ev:string): void{
    let filtration: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleDetailsFiltrationModel = {searchQuery: ev};
    this._fireFilterUnassociatedSubs(filtration)
  }



}
