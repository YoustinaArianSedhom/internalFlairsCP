import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MyTeamsState } from '@modules/my-accounts/state/my-accounts.state';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select, Store } from '@ngxs/store';
import { BasicSelectConfigModel } from '@shared/modules/selects/model/selects.model';
import * as MY_TASKS_CONFIGS from '../../models/my-tickets.config';
import * as MY_TASKS_ACTIONS from '../../state/my-tickets.actions';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { BreakpointObserver } from '@angular/cdk/layout';
import { HeadRefresherType } from '@core/services/head-refresher/head-refresher.models';
import { HeadRefresherService } from '@core/services/head-refresher/head-refresher.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import * as MY_TASKS_MODELS from '../../models/my-tickets.model';
import { RequestTeamModel } from '../../models/my-tickets.model';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ModalMyTicketsComponent } from '@modules/tickets/components/modal-my-tickets/modal-my-tickets.component';
import { MyTicketsState } from '@modules/tickets/state/my-tickets.state';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UserState } from '@core/modules/user/state/user.state';
import { UserModel } from '@modules/user-management/model/user-management.models';

@Component({
  selector: 'customerPortal-tickets-internal',
  templateUrl: './tickets-internal.component.html',
  styleUrls: ['./tickets-internal.component.scss'],
})
export class TicketsInternalComponent implements OnInit {
  constructor(
    private _store: Store,
    private _breakpointsObserver: BreakpointObserver,
    private _headRefresher: HeadRefresherService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.ticketForm = this.fb.group({
      contact: [''],
      role: [''],
    });
  }
  @ViewSelectSnapshot(MyTeamsState.searchQuery) public searchQuery: string;

  @Select(MyTeamsState.skills)
  public skills$: Observable<MY_TASKS_MODELS.Skill>;

  @Select(MyTicketsState.clients)
  public clients$: Observable<MY_TASKS_MODELS.Client[]>;

  @Select(MyTicketsState.portfolios)
  public portfolios$: Observable<MY_TASKS_MODELS.AssignedPortfolios[]>;

  @Select(MyTicketsState.contacts)
  public contacts$: Observable<MY_TASKS_MODELS.contactModel>;

  @Select(MyTicketsState.client)
  public clientIdFromState$: Observable<string>;

  @ViewSelectSnapshot(MyTicketsState.firstClient)
  public clientIdFromState: string;

  @Select(MyTicketsState.selectedPortfolio)
  public selectedPortfolio: Observable<string>;

  @ViewSelectSnapshot(MyTicketsState.firstClientPortfolio)
  public firstClientPortfolio: string;

  @ViewSelectSnapshot(MyTicketsState.firstPortfolio)
  public firstPortfolio: string;

  @Select(MyTicketsState.roles)
  public roles$: Observable<MY_TASKS_MODELS.roleModel>;

  @ViewSelectSnapshot(UserState.user) public User: UserModel;

  public headInformation = {
    title: 'Requests',
  };

  public cliendID: string;
  public PortfolioID: string;
  public teamID: string;
  public search: string;
  public status: number;
  public ticketForm: FormGroup;
  public resetSearch = false;
  public isClientSelected:boolean=false;
  public isPortfolioSelected:boolean=false;

  /*_______________Task status filtration configs__________________*/

  public Clients;
  public ClientsConfig: BasicSelectConfigModel = {
    placeholder: 'All',
    multiple: false,
    value: '',
  };

  public PortfoliosConfig: BasicSelectConfigModel = {
    placeholder: 'All',
    multiple: false,
    value: '',
  };

  public Contacts;
  public ContactsConfig: BasicSelectConfigModel = {
    placeholder: 'All',
    multiple: false,
    value: '',
  };

  public Roles;
  public RolesConfig: BasicSelectConfigModel = {
    placeholder: 'All',
    multiple: false,
    value: '',
  };

  public Skills;
  public SkillsConfig: BasicSelectConfigModel = {
    placeholder: 'All',
    multiple: true,
    value: '',
  };

  public teamsStatusOptions = MY_TASKS_CONFIGS.TEAMS_STATUS_OPTIONS;
  public teamsStatusSelectConfig: BasicSelectConfigModel = {
    placeholder: '',
    multiple: false,
    value: 1,
  };

  isMobile: boolean;

  displayFunction(object) {
    return object ? object.name : object;
  }

  ngOnInit(): void {
    this.setMode('Internal');
    this.getAllClients();

    this.clientIdFromState$.subscribe((clientid) => {
      console.log('hereeeee');
      if (clientid) {
        // this.getAllportfolios(clientid);
        this.ClientsConfig = {
          ...this.ClientsConfig,
          value: clientid,
        };
      }
    });

    this.selectedPortfolio.subscribe((portfolioId) => {
      if (portfolioId) {
        this.PortfoliosConfig = {
          ...this.PortfoliosConfig,
          value: portfolioId,
        };
      }
    });

    // this._fireMyTeamsTable(cliendID);
    // this.setClientId(cliendID);

    this.ticketForm
      .get('contact')
      .valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        if (typeof value === 'string' && value.trim().length) {
          this.getAllContacts(value);
        } else {
          this.Contacts = null;
        }
      });
    this.ticketForm
      .get('role')
      .valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        if (typeof value === 'string' && value.trim().length) {
          this.getAllRoles(value);
        } else {
          this.Roles = null;
          console.log('roles', this.Roles);
        }
      });
    this.contacts$.subscribe((data) => (this.Contacts = data));
    this.roles$.subscribe((data) => (this.Roles = data));
    this.isMobile = this._breakpointsObserver.isMatched('(max-width: 768px)');
    this.refreshHeadInformation();
  }

  public refreshHeadInformation(): void {
    this._headRefresher.refresh(this.headInformation);
  }

  resetFilter() {
      this.resetFiltersAndFireTable();
      this.getAllportfolios(this.clientIdFromState)
      this.ClientsConfig = {
        ...this.ClientsConfig,
        value: this.clientIdFromState,
      };
     
      this.PortfoliosConfig = {
        ...this.PortfoliosConfig,
        value:this.firstPortfolio
      }
      this.ticketForm.get('contact').setValue('');
      this.ticketForm.get('role').setValue('');
      this.resetSearch = !this.resetSearch;

      this.isClientSelected = false;
      this.isPortfolioSelected = false;
  }

  resetContactSearch() {
    this.ticketForm.controls.contact.setValue('');
    this.fireFilterByContacts('');
  }

  resetRoleSearch() {
    this.ticketForm.controls.role.setValue('');
    this.fireFilterByRoles('');
  }

  public fireModal(event) {
    // console.log('id', event);
    const dialogRef = this.dialog.open(ModalMyTicketsComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('The dialog was closed');
    });
  }

  ngOnDestroy() {
    // this.resetFiltersAndPagination();
  }

  @Dispatch() public resetFiltersAndFireTable() {
    return [
      new MY_TASKS_ACTIONS.setFilters({
        role: undefined,
        contactId: undefined,
        accountId: this.clientIdFromState,
        portfolioId: this.firstPortfolio,
        searchQuery: undefined,
      }),
      new MY_TASKS_ACTIONS.FilterMyInternalTickets(),
    ];
  }

  @Dispatch() public setClientId(clientId: string) {
    console.log(clientId);
    return new MY_TASKS_ACTIONS.setClientId(clientId);
  }

  @Dispatch() public getAllClients() {
    return new MY_TASKS_ACTIONS.getAllClients();
  }

  @Dispatch() public getAllportfolios(clientId) {
    return new MY_TASKS_ACTIONS.getAllPortfolios(clientId);
  }

  @Dispatch() public getSkills(query) {
    return new MY_TASKS_ACTIONS.getSkills(query);
  }

  @Dispatch() public fireFilterByContacts(contactID) {
    if (contactID === '') {
      contactID = undefined;
    }

    // const payload: RequestTeamModel = {
    //   contactId: contactID,
    // };

    return [
      new MY_TASKS_ACTIONS.setFilters({ contactId: contactID }),
      new MY_TASKS_ACTIONS.FilterMyInternalTickets(),
    ];
  }

  @Dispatch() public fireFilterByRoles(roleName) {
    // console.log('here');

    if (roleName === '') {
      roleName = undefined;
    }

    const payload: RequestTeamModel = {
      role: roleName,
    };

    return [
      new MY_TASKS_ACTIONS.setFilters({ role: roleName }),
      new MY_TASKS_ACTIONS.FilterMyInternalTickets(),
    ];
  }

  @Dispatch() public fireFilterByClient(clientID) {
    this.isClientSelected = this.clientIdFromState === clientID ? false : true;
    this.ClientsConfig = {...this.ClientsConfig,value:clientID}
    return [
      new MY_TASKS_ACTIONS.setClientId(clientID),
      new MY_TASKS_ACTIONS.getAllPortfolios(clientID),
    ];
  }

  @Dispatch() public fireFilterByPortfolio(portfolioId) {
    this.isPortfolioSelected = this.firstClientPortfolio === portfolioId ? false : true;
    this.PortfoliosConfig = {...this.PortfoliosConfig,value:portfolioId}
    return [
      new MY_TASKS_ACTIONS.setSelectedPortfolioId(portfolioId),
      new MY_TASKS_ACTIONS.setFilters({ portfolioId }),
      new MY_TASKS_ACTIONS.FilterMyInternalTickets(),
    ];
  }

  public selectionChange($event) {
    // console.log('selectionChange', $event);
  }

  @Dispatch() public fireSearchMyTicketsBySearch(searchQuery: string) {
    if (searchQuery === '') {
      searchQuery = undefined;
    }

    return [
      new MY_TASKS_ACTIONS.setFilters({ searchQuery }),
      new MY_TASKS_ACTIONS.FilterMyInternalTickets(),
    ];
  }

  @Dispatch() private _fireMyTeamsTable(clientID) {
    const payload: RequestTeamModel = {
      accountId: clientID,
    };
    // console.log('hereee', payload);
    return new MY_TASKS_ACTIONS.GetMyInternalTickets(payload);
  }

  @Dispatch() public getAllContacts(query) {
    return new MY_TASKS_ACTIONS.GetContacts(query);
  }

  @Dispatch() public resetFiltersAndPagination() {
    return new MY_TASKS_ACTIONS.resetFiltersAndPagination();
  }

  @Dispatch() public getAllRoles(query) {
    return new MY_TASKS_ACTIONS.GetRoles(query);
  }

  @Dispatch() public setMode(mode) {
    return new MY_TASKS_ACTIONS.setMode(mode);
  }
}
