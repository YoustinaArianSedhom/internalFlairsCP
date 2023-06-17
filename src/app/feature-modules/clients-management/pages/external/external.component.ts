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
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { HeadRefresherService } from '@core/services/head-refresher/head-refresher.service';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import * as CLIENTS_MANAGEMENT_MODELS from '../../models/clients-management.models';
import * as CLIENTS_MANAGEMENT_ACTIONS from '../../state/clients-managements.actions';
import { ClientsManagementState } from '@modules/clients-management/state/clients-managements.state';
import { BasicSelectConfigModel } from '@shared/modules/selects/model/selects.model';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ModalCreateAdminComponent } from '@modules/organization/components/modal-create-admin/modal-create-admin.component';
import { getTree } from '@modules/organization/state/organization.actions';

@Component({
  selector: 'app-external',
  templateUrl: './external.component.html',
  styleUrls: ['./external.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class ExternalComponent implements OnInit, OnDestroy {

  @Select(ClientsManagementState.ClientIDS)
  public clients$: Observable<CLIENTS_MANAGEMENT_MODELS.Client>;

  @Select(ClientsManagementState.Portfolios)
  public portfolios$: Observable<CLIENTS_MANAGEMENT_MODELS.Portfolios[]>;

  @Select(ClientsManagementState.Teams)
  public teams$: Observable<CLIENTS_MANAGEMENT_MODELS.Teams[]>;

  @ViewSelectSnapshot(ClientsManagementState.Teams)
  public teamsFromState: CLIENTS_MANAGEMENT_MODELS.Teams[];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public headInformation = {
    title: 'User Management - External',
  };

  clientId: string;
  public resetSearch = false;
  public isClientSelected = false;
  public isPortfolioSelected = false;
  public isTeamSelected = false;
  

  public Clients;
  public ClientsConfig: BasicSelectConfigModel = {
    placeholder: 'All',
    multiple: false,
    value: '',
  };

  public Portfolios;
  public PortfoliosConfig: BasicSelectConfigModel = {
    placeholder: 'All',
    multiple: false,
    value: '',
  };

  public Teams;
  public TeamsConfig: BasicSelectConfigModel = {
    placeholder: 'All',
    multiple: false,
    value: '',
  };


  constructor(
    private cd: ChangeDetectorRef,
    public dialog: MatDialog,
    private _headRefresher: HeadRefresherService,
    private _router: Router,
    private route: ActivatedRoute
  ) {}

  @Dispatch() fireFilterByClient(clientId: string) {
    this.isClientSelected = clientId === '' ? false : true;
    this.ClientsConfig = {...this.ClientsConfig,value:clientId};
    this.PortfoliosConfig = { ...this.PortfoliosConfig, value: '' };
    this.TeamsConfig = { ...this.TeamsConfig, value: '' };
    this.isPortfolioSelected = false;
    this.isTeamSelected = false;

    if (clientId === '') {
      clientId = undefined;
    }

    this.clientId = clientId;

    return [
      new CLIENTS_MANAGEMENT_ACTIONS.getAllowedPortfolios(clientId),
      new CLIENTS_MANAGEMENT_ACTIONS.getAllowedTeams({ accountId: clientId }),
    ];
  }

  @Dispatch() fireFilterByPortfolio(portfolioId: string) {
    this.isPortfolioSelected = portfolioId === '' ? false : true;
    this.PortfoliosConfig = {...this.PortfoliosConfig,value:portfolioId};
    this.TeamsConfig = { ...this.TeamsConfig, value: '' };
    this.isTeamSelected = false;

    if (portfolioId === '') {
      portfolioId = undefined;
    }
    return [
      new CLIENTS_MANAGEMENT_ACTIONS.getAllowedTeams({
        PortfolioId: portfolioId,
        accountId: this.clientId,
      }),
    ];
  }

  @Dispatch() fireFilterByTeam(teamId: string) {
    this.isTeamSelected = teamId === '' ? false : true;
    this.TeamsConfig = {...this.TeamsConfig,value:teamId};
    if (teamId === '') {
      const allTeamsIds = this.teamsFromState
        .filter((team) => team.id !== '')
        .map((team) => team.id);
      return [
        new CLIENTS_MANAGEMENT_ACTIONS.setFilters({
          teamsIds: allTeamsIds,
        }),
        new CLIENTS_MANAGEMENT_ACTIONS.FilterAdmins(),
      ];
    }
    return [
      new CLIENTS_MANAGEMENT_ACTIONS.setFilters({
        teamsIds: [teamId],
      }),
      new CLIENTS_MANAGEMENT_ACTIONS.FilterAdmins(),
    ];
  }

  @Dispatch() fireExternalAdminsTable() {
    return [
      new CLIENTS_MANAGEMENT_ACTIONS.resetFilters(),
      new CLIENTS_MANAGEMENT_ACTIONS.FilterAdmins(),
    ];
  }

  @Dispatch() fireExternalAdminsTableOnInit() {
    return [
      new CLIENTS_MANAGEMENT_ACTIONS.setFilters({ teamsIds: undefined }),
      new CLIENTS_MANAGEMENT_ACTIONS.FilterAdmins(),
    ];
  }

  @Dispatch() fireFilterBysearchQuery(searchQuery: string) {
    return [
      new CLIENTS_MANAGEMENT_ACTIONS.setFilters({
        searchQuery,
      }),
      new CLIENTS_MANAGEMENT_ACTIONS.FilterAdmins(),
    ];
  }

  @Dispatch() private _getOrganizationTree() {
    return new getTree();
  }

  @Dispatch() private _getAllClients() {
    return new CLIENTS_MANAGEMENT_ACTIONS.getClientsIDS();
  }

  @Dispatch() private _resetFilters() {
    return new CLIENTS_MANAGEMENT_ACTIONS.resetFilters();
  }

  @Dispatch() private getAllowedPortfolios(id: string) {
    return new CLIENTS_MANAGEMENT_ACTIONS.getAllowedPortfolios(id);
  }

  @Dispatch() private getAllowedTeams(payload: CLIENTS_MANAGEMENT_MODELS.GetMyTeamsFilteration) {
    return new CLIENTS_MANAGEMENT_ACTIONS.getAllowedTeams(payload);
  }

  @Dispatch() private changMode(Mode: string) {
    return new CLIENTS_MANAGEMENT_ACTIONS.changeMode(Mode);
  }

  ngOnInit() {
    this.changMode('External');
    this.refreshHeadInformation();

    this._getOrganizationTree();
    this.route.params.subscribe((params: Params) => {
      const id = params.id;
      // console.log('id', id);
      if (id !== 'all') {
        // this.fireFilterByClient(id);
        this.getAllowedPortfolios(id);
        this.getAllowedTeams({ accountId: id });
        this.ClientsConfig = { ...this.ClientsConfig, value: id };
        // this.showFilters = true;
      } else {
        // this.fireFilterByClient(undefined);
        // this.getAllowedPortfolios(undefined);
        // this.getAllowedTeams({});
        this.fireExternalAdminsTableOnInit();
      }
    });
  }

  resetFilter() {
    
      this.fireExternalAdminsTable();
      this.resetSearch = !this.resetSearch;

      this.isClientSelected = false;
      this.isPortfolioSelected = false;
      this.isTeamSelected = false;

      this.ClientsConfig = {...this.ClientsConfig,value:''};
      this.PortfoliosConfig = {...this.PortfoliosConfig,value:''};
      this.TeamsConfig = {...this.TeamsConfig,value:''};
    
  }

  ngOnDestroy() {
    this._resetFilters();
  }

  onFiltersToggleChange(event: any) {
    if (event.checked) {
      this.getAllowedPortfolios(undefined);
      this.getAllowedTeams({});
    } else {
      this.fireExternalAdminsTableOnInit();
    }
  }

  public refreshHeadInformation(): void {
    this._headRefresher.refresh(this.headInformation);
    this._getAllClients();
    this.clients$.subscribe((data) => (this.Clients = data));
  }

  openAddAdminToClient() {
    const dialogRef = this.dialog.open(ModalCreateAdminComponent, {
      width: '500px',
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }
}
