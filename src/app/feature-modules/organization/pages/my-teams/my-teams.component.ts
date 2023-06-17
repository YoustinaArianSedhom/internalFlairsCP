import { ModalAddTeamComponent } from '../../components/modal-add-team/modal-add-team.component';
import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';

import * as CLIENTS_MODELS from '../../models/clients.models';
import * as CLIENTS_ACTIONS from '../../state/organization.actions';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { OrganizationState } from '@modules/organization/state/organization.state';
import { HeadRefresherService } from '@core/services/head-refresher/head-refresher.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'customerPortal-my-teams',
  templateUrl: './my-teams.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class MyTeamsComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public headInformation = {
    title: 'Organization - Platforms',
  };
  public initialSearchValue: string = 'hi';

  // @ViewSelectSnapshot(OrganizationState.Organization)
  // public Organization: CLIENTS_MODELS.Client[];

  // @Select(OrganizationState.Organization)
  // public organization$: Observable<CLIENTS_MODELS.Client>;

  @ViewChild('searchInput', {
    static: true,
  })
  public searchInput;

  @ViewSelectSnapshot(OrganizationState.paginationConfig)
  public pagination: PaginationConfigModel;

  @ViewSelectSnapshot(OrganizationState.Entities)
  public Entities: CLIENTS_MODELS.Entities;

  @ViewSelectSnapshot(OrganizationState.SelectedClient)
  public SelectedClient: CLIENTS_MODELS.Client;

  @ViewSelectSnapshot(OrganizationState.SelectedPortfolio)
  public SelectedPortfolio: CLIENTS_MODELS.Portfolios;

  @ViewSelectSnapshot(OrganizationState.SelectedTeam)
  public SelectedTeam: CLIENTS_MODELS.Teams;

  @ViewSelectSnapshot(OrganizationState.TableMode)
  public TableMode: number;

  portfolioID: string;
  public resetSearch = false;

  constructor(
    private cd: ChangeDetectorRef,
    public dialog: MatDialog,
    private _headRefresher: HeadRefresherService,
    private _router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.portfolioID = this.route.snapshot.params['portfolioID'];
    this.refreshHeadInformation();
    // this._resetSelectedClient();
    // this._resetSelectedPortfolio();
    // this._resetSelectedTeam();
  }

  ngOnDestroy() {
    this._resetFilters();
  }
  resetFilter(){
    this.resetSearch = !this.resetSearch;
    this.fireFilterBysearchQuery('')
      }

  fireFilterBysearchQuery(search) {
    this._fireFilterTeamBySearchQuery(search);
  }

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
    this._router.navigate([`/organization/teams/${this.SelectedTeam.id}`]);
    this._resetSelectedTeam();
  }

  openAddTeamModal(client, portfolio) {
    let modalData = { client, portfolio };
    const dialogRef = this.dialog.open(ModalAddTeamComponent, {
      width: '650px',
      data: modalData,
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  @Dispatch() private _resetFilters() {
    return new CLIENTS_ACTIONS.resetFilters();
  }

  @Dispatch() private _fireGetEntities() {
    // console.log('here');
    return new CLIENTS_ACTIONS.getEntities();
  }

  @Dispatch() private _resetSelectedPortfolio() {
    return new CLIENTS_ACTIONS.resetPortfolioSelected();
  }

  @Dispatch() private _resetSelectedClient() {
    return new CLIENTS_ACTIONS.resetClientSelected();
  }

  @Dispatch() private _resetSelectedTeam() {
    return new CLIENTS_ACTIONS.resetTeamSelected();
  }

  @Dispatch() private _fireFilterTeamBySearchQuery(search) {
    return [
      new CLIENTS_ACTIONS.setFilters({
        searchQuery: search,
        portfolioId: this.portfolioID,
      }),
      new CLIENTS_ACTIONS.searchTeams(),
    ];
  }
}
