import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import * as BILLING_ACTIONS from '@modules/billing-cycles/state/billing-cycles.actions'
import { HeadRefresherService } from '@core/services/head-refresher/head-refresher.service';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { BillingCyclesState } from '@modules/billing-cycles/state/billing-cycles.state';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Location } from '@angular/common';
import * as BILLING_CYCLES_MODELS from '@modules/billing-cycles/models/billing-cycles.models';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'customerPortal-manage-billing-cycle-details',
  templateUrl: './manage-billing-cycle-details.component.html',
  styles: [
    `
      :host {
        display: block;
      }
      h2 { 
        margin: 0px;
      }
    `
  ]
})
export class ManageBillingCycleDetailsComponent implements OnInit {
  @ViewSelectSnapshot(BillingCyclesState.poSearchQuery) public searchQuery: string;
  @Select(BillingCyclesState.selectedCycle) public selectedCycle$: Observable<BILLING_CYCLES_MODELS.BillingCycleModel>;
  @ViewSelectSnapshot(BillingCyclesState.showBillingRateAndAmount) public showBillingRateAndAmount: boolean;
  public headInformation = {
    title: 'Resources of'
  }
  public isMobile: boolean;
  public resetSearch = false;

  constructor(
    private _route: ActivatedRoute,
    private _breakpointsObserver: BreakpointObserver,
    private _headRefresher: HeadRefresherService,
    private _location: Location
  ) { }
  @Dispatch() public exportBillingCycleDetailsAsExcel() { return new BILLING_ACTIONS.ExportBillingCycleDetailsAsExcel() }
  @Dispatch() public fireSearchBillingCycleDetails(searchQuery: string ) { return new BILLING_ACTIONS.SearchBillingCycleDetails(searchQuery) }
  @Dispatch() private _fireSetBillingCycleId(billingCycleId: string) { return new BILLING_ACTIONS.SetBillingCycleId(billingCycleId) }
  
  ngOnInit(): void {
    this._fireSetBillingCycleId(this._route.snapshot.params.id);
    
    this.isMobile = this._breakpointsObserver.isMatched('(max-width: 768px)');
    this.refreshHeadInformation();
    this.selectedCycle$.subscribe(res=>{
      if(res){
        this.headInformation.title = `Resources of ${res?.name ? res?.name : 'N/A'}`;
        this.refreshHeadInformation();
      }
    })
  }
  public refreshHeadInformation(): void {
    this._headRefresher.refresh(this.headInformation);
  }


  public resetFilter() {
    this.resetSearch = !this.resetSearch;
    this.fireSearchBillingCycleDetails('')
  }

  public navigateBack() {
    this._location.back();
  }

  public toggleShowBillingRate(){
    this._fireToggleShowBillingRate()
  }

  @Dispatch() private _fireToggleShowBillingRate() { return new BILLING_ACTIONS.ToggleShowBillingRateAndAmount()}


}
