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

@Component({
  selector: 'customerPortal-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss'],
})
export class TicketsComponent implements OnInit {
  constructor(
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

  @Select(MyTicketsState.portfolios)
  public portfolios$: Observable<MY_TASKS_MODELS.AssignedPortfolios[]>;

  @ViewSelectSnapshot(MyTicketsState.selectedPortfolio)
  public selectedPortfolio: string;

  @ViewSelectSnapshot(MyTicketsState.firstPortfolio)
  public firstPortfolio: string;

  @Select(MyTicketsState.selectedPortfolio)
  public selectedPortfolio$: Observable<string>;

  @Select(MyTeamsState.skills)
  public skills$: Observable<MY_TASKS_MODELS.Skill>;

  @Select(MyTicketsState.contacts)
  public contacts$: Observable<MY_TASKS_MODELS.contactModel>;

  @Select(MyTicketsState.roles)
  public roles$: Observable<MY_TASKS_MODELS.roleModel>;

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
  public isPortfolioSelected : boolean = false

  /*_______________Task status filtration configs__________________*/

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

  public PortfolioSelectConfig: BasicSelectConfigModel = {
    placeholder: 'All',
    multiple: false,
    value: '',
  };

  isMobile: boolean;

  displayFunction(object) {
    return object ? object.name : object;
  }

  ngOnInit(): void {
    this.setMode('External');

    this.selectedPortfolio$.subscribe((portfolio) => {
      if (portfolio) {
        this.PortfolioSelectConfig = {
          ...this.PortfolioSelectConfig,
          value: portfolio,
        };
      }
    });

    this.ticketForm
      .get('contact')
      .valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        if (typeof value === 'string' && value !== '') {
          if (value.replace(/\s/g, '').length) {
            this.getAllContacts(value);
          }
        } else {
          this.Contacts = null;
        }
      });
    this.ticketForm
      .get('role')
      .valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        if (typeof value === 'string' && value !== '') {
          if (value.replace(/\s/g, '').length) {
            this.getAllRoles(value);
          }
        } else {
          this.Roles = null;
        }
      });
    this.contacts$.subscribe((data) => (this.Contacts = data));
    this.roles$.subscribe((data) => (this.Roles = data));
    this.route.params.subscribe((params: Params) => {
      this.resetFiltersAndPagination();
      this.cliendID = params['ticketsClientId'];
      this.setClientId(this.cliendID);
      this.getMyAssignedPortfolios(this.cliendID);
    });
    this.isMobile = this._breakpointsObserver.isMatched('(max-width: 768px)');
    this.refreshHeadInformation();
  }

  public refreshHeadInformation(): void {
    this._headRefresher.refresh(this.headInformation);
  }

  clearFilter() {
   
      this.resetFiltersAndFireTable();
      this.ticketForm.get('contact').setValue('');
      this.ticketForm.get('role').setValue('');
      this.resetSearch = !this.resetSearch;
      this.PortfolioSelectConfig = {
        ...this.PortfolioSelectConfig,
        value:this.firstPortfolio
      }

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
    this.resetFiltersAndPagination();
  }

  @Dispatch() public setClientId(clientId: string) {
    return new MY_TASKS_ACTIONS.setClientId(clientId);
  }

  @Dispatch() public getSkills(query) {
    return new MY_TASKS_ACTIONS.getSkills(query);
  }

  // @Dispatch() public fireGetMyAssignedTeams(
  //   clientID: string,
  //   portfolioId: string
  // ) {
  //   return new MY_TASKS_ACTIONS.GetAssignedTeams(clientID, portfolioId);
  // }

  @Dispatch() public fireFilterByContacts(contactID) {
    if (contactID === '') {
      contactID = undefined;
    }

    const payload: RequestTeamModel = {
      contactId: contactID,
    };

    return [
      new MY_TASKS_ACTIONS.setFilters(payload),
      new MY_TASKS_ACTIONS.FilterMyTickets(),
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
      new MY_TASKS_ACTIONS.setFilters(payload),
      new MY_TASKS_ACTIONS.FilterMyTickets(),
    ];
  }

  @Dispatch() fireFilterByPortfolio(portfolioId) {
    this.isPortfolioSelected = this.firstPortfolio === portfolioId ? false : true;
    this.PortfolioSelectConfig = {...this.PortfolioSelectConfig,value:portfolioId}
    return [
      new MY_TASKS_ACTIONS.setSelectedPortfolioId(portfolioId),
      new MY_TASKS_ACTIONS.setFilters({ portfolioId }),
      new MY_TASKS_ACTIONS.FilterMyTickets(),
    ];
  }

  public selectionChange($event) {
    // console.log('selectionChange', $event);
  }

  @Dispatch() public resetFiltersAndFireTable() {
    return [
      new MY_TASKS_ACTIONS.setFilters({
        searchQuery: undefined,
        role: undefined,
        portfolioId: this.firstPortfolio,
        contactId: undefined,
      }),
      ,
      new MY_TASKS_ACTIONS.FilterMyTickets(),
    ];
  }

  @Dispatch() public fireSearchMyTicketsBySearch(searchQuery: string) {
    if (searchQuery === '') {
      searchQuery = undefined;
    }
    const payload: RequestTeamModel = {
      searchQuery,
    };
    return [
      new MY_TASKS_ACTIONS.setFilters(payload),
      new MY_TASKS_ACTIONS.FilterMyTickets(),
    ];
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

  @Dispatch() public getMyAssignedPortfolios(clientId) {
    return new MY_TASKS_ACTIONS.getAllPortfolios(clientId);
  }

  @Dispatch() public setMode(mode) {
    return new MY_TASKS_ACTIONS.setMode(mode);
  }
}
