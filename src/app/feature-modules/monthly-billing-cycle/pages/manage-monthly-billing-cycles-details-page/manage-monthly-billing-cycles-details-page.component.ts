import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeadRefresherService } from '@core/services/head-refresher/head-refresher.service';
import * as MONTHLY_BILLING_ACTIONS from '@modules/monthly-billing-cycle/state/monthly-billing-cycle.actions'
import { MonthlyBillingCyclesState, MonthlyBillingStateModel } from '@modules/monthly-billing-cycle/state/monthly-billing-cycle.state';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import * as MONTHLY_BILLING_CYCLES_MODELS from '@modules/monthly-billing-cycle/models/monthly-billing-cycle.models';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Location } from '@angular/common';
import { Store } from '@ngxs/store';
import { StateOverwrite } from 'ngxs-reset-plugin';

@Component({
  selector: 'customerPortal-manage-monthly-billing-cycles-details-page',
  templateUrl: './manage-monthly-billing-cycles-details-page.component.html',
  styles: [
    `
      :host {
        display: block;
      }
      :host::ng-deep .mat-input-element {
        min-width: 250px !important;
      }
    `
  ]
})
export class ManageMonthlyBillingCyclesDetailsPageComponent implements OnInit, OnDestroy {
  @ViewSelectSnapshot(MonthlyBillingCyclesState.monthlyBillingCyclesDetailsSearchQuery) public searchQuery: string;
  @ViewSelectSnapshot(MonthlyBillingCyclesState.unassociatedSubsCount) public unassociatedSubsCount: number;
  @ViewSelectSnapshot(MonthlyBillingCyclesState.showBillingRateAndAmount) public showBillingRateAndAmount: boolean;
  public headInformation = {
    title : 'Monthly Billing Cycle details of ' + this._route.snapshot.params.month + '/' + this._route.snapshot.params.year
  }
  public  isMobile: boolean;
  public resetSearch = false;
 

  constructor(
    private _headRefresher : HeadRefresherService , 
    private _breakpointsObserver: BreakpointObserver,
    private  _route : ActivatedRoute,
    private _location: Location,
    private _router: Router,
    private _store: Store,
    ) { }
  
  @Dispatch() public exportMonthlyBillingCyclesDetailsAsExcel() { return new MONTHLY_BILLING_ACTIONS.ExportMonthlyBillingCyclesDetailsAsExcel() }
  @Dispatch() private _fireFilterMonthlyBillingCyclesDetails(filtration: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleDetailsFiltrationModel) {return new MONTHLY_BILLING_ACTIONS.FilterMonthlyBillingCyclesDetails(filtration)}
  @Dispatch() private _fireGetUnassociatedSubsCount(filtration: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleDetailsFiltrationModel) { return new MONTHLY_BILLING_ACTIONS.GetUnassociatedSubsCount(filtration)}
  ngOnInit(): void {
    this.isMobile = this._breakpointsObserver.isMatched('(max-width: 768px)');
    this.refreshHeadInformation();
    let filtration: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleDetailsFiltrationModel = {
      month: +this._route.snapshot.params.month,
      year: +this._route.snapshot.params.year,
    }
    this._fireFilterMonthlyBillingCyclesDetails(filtration);
    this._fireGetUnassociatedSubsCount(filtration)
  }
  public refreshHeadInformation(): void {
    this._headRefresher.refresh(this.headInformation);
  }

  public resetFilter(){
    this.resetSearch = !this.resetSearch;
    this.onSearchChange('')
  }

  public onSearchChange(ev:string){
    let filtration: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleDetailsFiltrationModel = {searchQuery: ev};
    this._fireFilterMonthlyBillingCyclesDetails(filtration)
  }

  public navigateBack() {
    this._location.back();
  }

  public navigateToViewUnassociatedSubs(){
    this._router.navigate(['monthly-billing-cycle', 'view-unassociated-subs' ,  this._route.snapshot.params.month , this._route.snapshot.params.year])
  }

  public toggleShowAmount(){
    this._fireToggleShowAmount()
  }

  public ngOnDestroy() {
    this._store.dispatch(new StateOverwrite([MonthlyBillingCyclesState, new MonthlyBillingStateModel()]))
    
  }

  @Dispatch() private _fireToggleShowAmount() { return new MONTHLY_BILLING_ACTIONS.ToggleShowAmount()}


}
