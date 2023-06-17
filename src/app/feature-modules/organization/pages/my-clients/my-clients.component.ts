import { ModalMemberTeamComponent } from '../../components/modal-member-team/modal-member-team.component';
import { ModalDeleteTeamComponent } from '../../components/modal-delete-team/modal-delete-team.component';
import { ModalAddTeamComponent } from '../../components/modal-add-team/modal-add-team.component';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import {
  ChangeDetectorRef,
  Component,
  DoCheck,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ModalAddClientComponent } from '@modules/organization/components/modal-add-client/modal-add-client.component';
import { ModalAddPortfolioComponent } from '@modules/organization/components/modal-add-portfolio/modal-add-portfolio.component';
import { ModalMyTeamsComponent } from '@modules/my-accounts/components/modal-my-teams/modal-my-teams.component';
import { ModalDeleteClientComponent } from '@modules/organization/components/modal-delete-client/modal-delete-client.component';
import { RequestTeamModel } from '@modules/my-accounts/models/my-accounts.model';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';

import * as CLIENTS_MODELS from '../../models/clients.models';
import * as CLIENTS_CONFIGS from '../../models/clients.config';
import * as CLIENTS_ACTIONS from '../../state/organization.actions';
import { MyTeamsState } from '@modules/my-accounts/state/my-accounts.state';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { OrganizationState } from '@modules/organization/state/organization.state';
import { ModalEditClientComponent } from '@modules/organization/components/modal-edit-client/modal-edit-client.component';
import { ModalEditPortfolioComponent } from '@modules/organization/components/modal-edit-portfolio/modal-edit-portfolio.component';
import { ModalDeletePortfolioComponent } from '@modules/organization/components/modal-delete-portfolio/modal-delete-portfolio.component';
import { BasicSelectConfigModel } from '@shared/modules/selects/model/selects.model';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { HeadRefresherService } from '@core/services/head-refresher/head-refresher.service';

@Component({
  selector: 'customerPortal-my-clients',
  templateUrl: './my-clients.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class MyClientsComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public headInformation = {
    title: 'Organization - Accounts',
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

  public resetSearch:boolean = false;

  constructor(
    private cd: ChangeDetectorRef,
    public dialog: MatDialog,
    private _headRefresher: HeadRefresherService
  ) {}

  ngOnInit() {
    this.refreshHeadInformation();
    this._resetSelectedClient();
    this._resetSelectedPortfolio();
    this._resetSelectedTeam();
    // this._fireChangeTableMode(0);
  }

  ngOnDestroy() {
    this._resetFilters();
  }

  fireFilterBysearchQuery(search) {
    this._fireFilterClientBySearchQuery(search);
  }

  public refreshHeadInformation(): void {
    this._headRefresher.refresh(this.headInformation);
  }

  resetFilter(){
this.resetSearch = !this.resetSearch;
this.fireFilterBysearchQuery('')
  }

  openAddClientModal() {
    const dialogRef = this.dialog.open(ModalAddClientComponent, {
      width: '650px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('The dialog was closed');
    });
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

  @Dispatch() private _resetFilters() {
    return new CLIENTS_ACTIONS.resetFilters();
  }

  @Dispatch() private _fireFilterClientBySearchQuery(search) {
    return [
      new CLIENTS_ACTIONS.setFilters({
        searchQuery: search,
      }),
      new CLIENTS_ACTIONS.searchClient(),
    ];
  }
}
