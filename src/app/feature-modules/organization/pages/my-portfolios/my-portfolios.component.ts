import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ModalAddClientComponent } from '@modules/organization/components/modal-add-client/modal-add-client.component';
import { ModalAddPortfolioComponent } from '@modules/organization/components/modal-add-portfolio/modal-add-portfolio.component';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';

import * as CLIENTS_MODELS from '../../models/clients.models';
import * as CLIENTS_ACTIONS from '../../state/organization.actions';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { OrganizationState } from '@modules/organization/state/organization.state';
import { HeadRefresherService } from '@core/services/head-refresher/head-refresher.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'customerPortal-my-portfolios',
  templateUrl: './my-portfolios.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class MyPortfoliosComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public headInformation = {
    title: 'Organization - Portfolios',
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

  clientID: string;
  public resetSearch = false;

  constructor(
    private cd: ChangeDetectorRef,
    public dialog: MatDialog,
    private _headRefresher: HeadRefresherService,
    private _router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.clientID = this.route.snapshot.params['clientdID'];
    this.refreshHeadInformation();
    // this._resetSelectedClient();
    // this._resetSelectedPortfolio();
    this._resetSelectedTeam();
    // this._fireChangeTableMode(0);
  }

  ngOnDestroy() {
    this._resetFilters();
  }

  resetFilter(){
    this.resetSearch = !this.resetSearch;
    this.fireFilterBysearchQuery('')
      }
    
  fireFilterBysearchQuery(search) {
    this._fireFilterPortfolioBySearchQuery(search);
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

  openAddClientModal() {
    const dialogRef = this.dialog.open(ModalAddClientComponent, {
      width: '650px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('The dialog was closed');
    });
  }

  openAddPortfolioModal(client) {
    const dialogRef = this.dialog.open(ModalAddPortfolioComponent, {
      width: '650px',
      data: client,
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('The dialog was closed');
    });
  }

  @Dispatch() private _resetFilters() {
    return new CLIENTS_ACTIONS.resetFilters();
  }

  @Dispatch() private _fireGetEntities() {
    // console.log('here');
    return new CLIENTS_ACTIONS.getEntities();
  }

  @Dispatch() private _fireChangeTableMode(mode) {
    return new CLIENTS_ACTIONS.changeTableMode(mode);
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

  @Dispatch() private _fireFilterPortfolioBySearchQuery(search) {
    console.log('here');
    return [
      new CLIENTS_ACTIONS.setFilters({
        searchQuery: search,
        accountId: this.clientID,
      }),
      new CLIENTS_ACTIONS.searchPortfolios(),
    ];
  }
}
