import { Component, OnInit, OnDestroy } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import * as BILLING_ACTIONS from '@modules/billing-cycles/state/billing-cycles.actions'
import { BreakpointObserver } from '@angular/cdk/layout';
import { HeadRefresherService } from '@core/services/head-refresher/head-refresher.service';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { BillingCyclesState, BillingStateModel } from '@modules/billing-cycles/state/billing-cycles.state';
import { Select, Store } from '@ngxs/store';
import { StateOverwrite } from 'ngxs-reset-plugin';
import { Observable } from 'rxjs';
import * as BILLING_CYCLES_MODELS from '@modules/billing-cycles/models/billing-cycles.models';
@Component({
  selector: 'customerPortal-manage-billing-cycles-page',
  templateUrl: './manage-billing-cycles-page.component.html',
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
export class ManageBillingCyclesPageComponent implements OnInit, OnDestroy {
  @ViewSelectSnapshot(BillingCyclesState.cyclesSearchQuery) public searchQuery!: string ;
  @ViewSelectSnapshot(BillingCyclesState.showAmount) public showAmount: boolean ;
  @Select(BillingCyclesState.billingCycles) public billingCycle$: Observable<BILLING_CYCLES_MODELS.BillingCycleModel[]>
  public headInformation = {
    title: 'Billing Cycle',
  };
  public  isMobile: boolean;
  public resetSearch = false;
  public shortageAmount: number;

  constructor(
    private _breakpointsObserver: BreakpointObserver,
    private _headRefresher: HeadRefresherService,
    private _store: Store,
  ) { }
  @Dispatch() public exportAsExcel() { return new BILLING_ACTIONS.ExportAsExcel()}
  @Dispatch() public fireSearchFilteredPage(searchQuery: string) {return new BILLING_ACTIONS.SearchFilteredPage(searchQuery)}
  @Dispatch() public fireGetFilteredPage() { return new BILLING_ACTIONS.GetFilteredPage() }
  ngOnInit(): void {
    this.isMobile = this._breakpointsObserver.isMatched('(max-width: 768px)');
    this.refreshHeadInformation();
    this.fireGetFilteredPage();
    this.billingCycle$.subscribe(res=>{
      if(res.length){
        this.shortageAmount = res?.filter(item=> item.hasShortage)?.length
      }
    })
  }

  public refreshHeadInformation(): void {
    this._headRefresher.refresh(this.headInformation);
  }


  public resetFilter(){
    this.resetSearch = !this.resetSearch;
    this.fireSearchFilteredPage('')
  }

  public toggleShowAmount(){
    this._fireToggleShowDetails()
  }

  public ngOnDestroy() {
    this._store.dispatch(new StateOverwrite([BillingCyclesState, new BillingStateModel()]))
  }

  @Dispatch() private _fireToggleShowDetails() { return new BILLING_ACTIONS.ToggleShowAmount()}

}
