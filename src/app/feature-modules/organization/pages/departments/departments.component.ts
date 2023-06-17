import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeadRefresherService } from '@core/services/head-refresher/head-refresher.service';
import { OrganizationState } from '@modules/organization/state/organization.state';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import * as CLIENTS_MODELS from '../../models/clients.models';
import * as CLIENTS_ACTIONS from '../../state/organization.actions';
@Component({
  selector: 'customerPortal-departments',
  templateUrl: './departments.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class DepartmentsComponent implements OnInit, OnDestroy {

  @ViewSelectSnapshot(OrganizationState.SelectedClient)
  public SelectedClient: CLIENTS_MODELS.Client;

  @ViewSelectSnapshot(OrganizationState.SelectedTeam)
  public SelectedTeam: CLIENTS_MODELS.Client;

  @ViewSelectSnapshot(OrganizationState.SelectedPortfolio)
  public SelectedPortfolio: CLIENTS_MODELS.Portfolios;

  public headInformation = {
    title: 'Organization - Departments',
  };

  private departmentID: string;


  constructor(private _headRefresher: HeadRefresherService,
    private _router: Router,
    private route: ActivatedRoute) { }

  
  
    @Dispatch() private _resetSelectedPortfolio() {
      return new CLIENTS_ACTIONS.resetPortfolioSelected();
    }
  
    @Dispatch() private _resetSelectedClient() {
      return new CLIENTS_ACTIONS.resetClientSelected();
    }
  
    @Dispatch() private _resetSelectedTeam() {
      return new CLIENTS_ACTIONS.resetTeamSelected();
    }

  ngOnInit(): void {
    this.departmentID = this.route.snapshot.params['departmentID'];
    this.refreshHeadInformation();
  }

  ngOnDestroy() {
    // this._resetFilters();
  }
  // resetFilter(){
  //   this.resetSearch = !this.resetSearch;
  //   this.fireFilterBysearchQuery('')
  //     }

  // fireFilterBysearchQuery(search) {
  //   this._fireFilterTeamBySearchQuery(search);
  // }

  public refreshHeadInformation(): void {
    this._headRefresher.refresh(this.headInformation);
  }

  clientClick() {
    this._router.navigate([
      `/organization/portfolios/${this.SelectedClient.id}`,
    ]);
    this._resetSelectedPortfolio();
    this._resetSelectedTeam();
  }

  allClientsClick() {
    this._router.navigate(['/organization']);
    this._resetSelectedClient();
    this._resetSelectedPortfolio();
    this._resetSelectedTeam();
  }

  PortfolioClick() {
    this._router.navigate([`/organization/teams/${this.SelectedPortfolio.id}`]);
    this._resetSelectedTeam();
  }
}
