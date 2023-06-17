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
import * as CLIENTS_MANAGEMENT_CONFIG from '../../models/clients-management.config';
import * as CLIENTS_MANAGEMENT_ACTIONS from '../../state/clients-managements.actions';
import { ClientsManagementState } from '@modules/clients-management/state/clients-managements.state';
import { BasicSelectConfigModel } from '@shared/modules/selects/model/selects.model';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalCreateAdminComponent } from '@modules/organization/components/modal-create-admin/modal-create-admin.component';
import { getTree } from '@modules/organization/state/organization.actions';

@Component({
  selector: 'app-internal',
  templateUrl: './internal.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class InternalComponent implements OnInit, OnDestroy {
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
    title: 'User Management - Internal',
  };

  public resetSearch = false;
  public isRoleSelected = false;
  public isClientSelected = false;
  public isPortfolioSelected = false;
  public isTeamSelected = false;
  public clientId;
  public showOrganizationFilters = false;


  public Roles = CLIENTS_MANAGEMENT_CONFIG.Roles;
  public RolesConfig: BasicSelectConfigModel = {
    placeholder: 'All',
    multiple: false,
    value: '',
  };

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


  @Dispatch() fireInternalAdminsTable() {
    return [
      new CLIENTS_MANAGEMENT_ACTIONS.resetInternalAdminFilters(),
      new CLIENTS_MANAGEMENT_ACTIONS.getAllowedTeams({
        accountId: undefined,
        PortfolioId: undefined,
      }),
    ];
  }

  @Dispatch() fireFilterBysearchQuery(search: string) {
    let searchQuery = search;
    if (searchQuery === '') {
      searchQuery = undefined;
    }
    return [
      new CLIENTS_MANAGEMENT_ACTIONS.setInternalAdminFilters({
        searchQuery,
      }),
      new CLIENTS_MANAGEMENT_ACTIONS.FilterInternalAdmins(),
    ];
  }

  @Dispatch() fireFilterByRoleDispatch(roleName: any) {
    return [
      new CLIENTS_MANAGEMENT_ACTIONS.setInternalAdminFilters({
        role: roleName,
        teamsIds: undefined,
      }),
      new CLIENTS_MANAGEMENT_ACTIONS.FilterInternalAdmins(),
    ];
  }

  
  @Dispatch() fireFilterByClient(clientId: string) {
    this.isClientSelected = clientId === '' ? false : true;
    this.ClientsConfig = { ...this.ClientsConfig, value: clientId };
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
    this.PortfoliosConfig = { ...this.PortfoliosConfig, value:  portfolioId};
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
    this.TeamsConfig = { ...this.TeamsConfig, value: teamId };
    if (teamId === '') {
      const allTeamsIds = this.teamsFromState
        .filter((team) => team.id !== '')
        .map((team) => team.id);
      return [
        new CLIENTS_MANAGEMENT_ACTIONS.setInternalAdminFilters({
          teamsIds: allTeamsIds,
        }),
        new CLIENTS_MANAGEMENT_ACTIONS.FilterInternalAdmins(),
      ];
    }

    return [
      new CLIENTS_MANAGEMENT_ACTIONS.setInternalAdminFilters({
        teamsIds: [teamId],
      }),
      new CLIENTS_MANAGEMENT_ACTIONS.FilterInternalAdmins(),
    ];
  }

  @Dispatch() fireInternalAdminsTableOnInit() {
    return [
      new CLIENTS_MANAGEMENT_ACTIONS.setInternalAdminFilters({
        teamsIds: undefined,
        searchQuery: undefined,
        role: undefined,
      }),
      new CLIENTS_MANAGEMENT_ACTIONS.FilterInternalAdmins(),
    ];
  }

   @Dispatch() private _getOrganizationTree() {
    return new getTree();
  }

  @Dispatch() private _getAllClients() {
    return new CLIENTS_MANAGEMENT_ACTIONS.getClientsIDS();
  }

  @Dispatch() private getAllowedPortfolios(id: string) {
    return new CLIENTS_MANAGEMENT_ACTIONS.getAllowedPortfolios(id);
  }

  @Dispatch() private getAllowedTeams(payload: CLIENTS_MANAGEMENT_MODELS.GetMyTeamsFilteration) {
    return new CLIENTS_MANAGEMENT_ACTIONS.getAllowedTeams(payload);
  }

  @Dispatch() private setInternalAdminsFilters(role: any) {
    return new CLIENTS_MANAGEMENT_ACTIONS.setInternalAdminFilters({ role });
  }

  @Dispatch() private _resetFilters() {
    return new CLIENTS_MANAGEMENT_ACTIONS.resetInternalAdminFilters();
  }
  @Dispatch() private changMode(Mode: string) {
    return new CLIENTS_MANAGEMENT_ACTIONS.changeMode(Mode);
  }

  ngOnInit() {
    this.changMode('Internal');
    this.fireInternalAdminsTableOnInit();
    this.refreshHeadInformation();
    this._getOrganizationTree();
  }

  resetFilter() {
   
      this.fireInternalAdminsTableOnInit();
      this.showOrganizationFilters = false;
      this.resetSearch = !this.resetSearch;

      this.isClientSelected = false;
      this.isPortfolioSelected = false;
      this.isRoleSelected = false;
      this.isTeamSelected = false;
      
      this.RolesConfig = {...this.RolesConfig, value:''};
      this.ClientsConfig = {...this.ClientsConfig, value:''};
      this.PortfoliosConfig = {...this.PortfoliosConfig, value:''};
      this.TeamsConfig = {...this.TeamsConfig, value:''};
    
  }

  ngOnDestroy() {
    this._resetFilters();
  }

  fireFilterByRole(roleID: any) {
    this.isRoleSelected = roleID === '' ? false : true;
    this.RolesConfig = { ...this.RolesConfig, value: roleID };

    const SelectedRole = CLIENTS_MANAGEMENT_CONFIG.Roles.filter(
      (role) => role.id === roleID
    );
    let roleName = SelectedRole[0].name;
    if (roleName === 'All') {
      roleName = undefined;
    }

    if (
      roleID === CLIENTS_MANAGEMENT_MODELS.roleMode.All ||
      roleID === CLIENTS_MANAGEMENT_MODELS.roleMode.superAdmin
    ) {
      this.showOrganizationFilters = false;
      this.fireFilterByRoleDispatch(roleName)
    } else {
      this.setInternalAdminsFilters(roleName);
      this.showOrganizationFilters = true;
      this._getAllClients();
      this.clients$.subscribe((data) => (this.Clients = data));
      this.getAllowedPortfolios(undefined);
      this.getAllowedTeams({});

      this.isClientSelected = false;
      this.isPortfolioSelected = false;
      this.isTeamSelected = false;

      this.ClientsConfig = {...this.ClientsConfig,value:''}
      this.PortfoliosConfig = {...this.PortfoliosConfig,value:''}
      this.TeamsConfig = {...this.TeamsConfig,value:''}
    }
  }


  public refreshHeadInformation(): void {
    this._headRefresher.refresh(this.headInformation);
  }

  openAddAdminToClient() {
    const dialogRef = this.dialog.open(ModalCreateAdminComponent, {
      width: '500px',
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }
}
