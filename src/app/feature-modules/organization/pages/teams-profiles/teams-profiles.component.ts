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
import { Dispatch } from '@ngxs-labs/dispatch-decorator';

import * as CLIENTS_MODELS from '../../models/clients.models';
import * as CLIENTS_ACTIONS from '../../state/organization.actions';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { OrganizationState } from '@modules/organization/state/organization.state';
import { HeadRefresherService } from '@core/services/head-refresher/head-refresher.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as Profile_MODELS from '../../../assigned-profiles/models/assigned-profile.model';


@Component({
  selector: 'customerPortal-teams-profiles',
  templateUrl: './teams-profiles.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class TeamsProfilesComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public headInformation = {
    title: 'Organization - Platform Members',
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
  public resetSearch = false;

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


  @ViewSelectSnapshot(OrganizationState.SelectedDepartment)
  public SelectedDepartment: CLIENTS_MODELS.Department;

  @ViewSelectSnapshot(OrganizationState.TableMode)
  public TableMode: number;

  teamID: string;
  departmentID: string;

  constructor(
    private cd: ChangeDetectorRef,
    public dialog: MatDialog,
    private _headRefresher: HeadRefresherService,
    private _router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.teamID = this.route.snapshot.params['teamID'];
    this.departmentID = this.route.snapshot.params['departmentID'];
    this.refreshHeadInformation();
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
    this._fireGetAssignedProfiles(search);
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
    this._resetSelectedDepartment();
  }

  allClientsClick() {
    this._router.navigate(['/organization']);
    this._resetSelectedClient();
    this._resetSelectedPortfolio();
    this._resetSelectedTeam();
    this._resetSelectedDepartment();
  }

  PortfolioClick() {
    this._router.navigate([`/organization/teams/${this.SelectedPortfolio.id}`]);
    this._resetSelectedTeam();
    this._resetSelectedDepartment();
  }

  TeamClick() {
    this._router.navigate([`/organization/departments/${this.SelectedTeam.id}`]);
    this._resetSelectedDepartment();
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

  @Dispatch() private _resetSelectedDepartment() {
    return new CLIENTS_ACTIONS.resetDepartmentSelected();
  }

  @Dispatch() private _resetFilters() {
    return new CLIENTS_ACTIONS.resetFilters();
  }

  @Dispatch() private _fireGetAssignedProfiles(searchQuery) {
    let filters: Profile_MODELS.AssignedProfileFiltrationModel;
    filters = {
      searchQuery,
      PlatformsIds: [this.teamID],
      department: +this.departmentID
    };
    return new CLIENTS_ACTIONS.getAssignedProfilesByTeam(filters);
  }
}
