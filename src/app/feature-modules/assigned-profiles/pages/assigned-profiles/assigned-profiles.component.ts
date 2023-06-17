import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { UserModel } from '@modules/user-management/model/user-management.models';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Select, Store } from '@ngxs/store';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { TablesService } from '@shared/modules/tables/model/tables.service';
import { Observable } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { HeadRefresherService } from '@core/services/head-refresher/head-refresher.service';
import { BasicSelectConfigModel } from '@shared/modules/selects/model/selects.model';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import * as ASSIGNED_PORTFOLIO_ACTIONS from '../../state/assigned_profile.actions';
import * as ASSIGNED_PORTFOLIO_MODELS from '../../models/assigned-profile.model';
import * as ASSIGNED_PORTFOLIO_CONFIG from '../../models/assigned-profile.config';
import { AssignedProfileState } from '@modules/assigned-profiles/state/assigned_profile.state';
import { ProfileState } from '@modules/profiles/state/profiles.state';
import * as PROFILE_ACTION from '@modules/profiles/state/profiles.actions';
import * as Profile_MODELS from '../../models/assigned-profile.model';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { HttpService } from '@core/http/http/http.service';
import { buildQueryString } from '@shared/helpers/build-query-string.helper';
import { ModalUploadComponent } from '@modules/assigned-profiles/components/modal-upload/modal-upload.component';


@Component({
  selector: 'app-assigned-profiles',
  templateUrl: './assigned-profiles.component.html',
  styleUrls: ['./assigned-profiles.component.scss']
})
export class AssignedProfilesComponent implements OnInit, OnDestroy {

  @Select(AssignedProfileState.Clients) public clients$: Observable<
    ASSIGNED_PORTFOLIO_MODELS.Client[]
  >;

  @Select(AssignedProfileState.Portfolios) public portfolios$: Observable<
    ASSIGNED_PORTFOLIO_MODELS.Portfolio[]
  >;

  @Select(AssignedProfileState.Teams) public teams$: Observable<
    ASSIGNED_PORTFOLIO_MODELS.Team[]
  >;

  @ViewSelectSnapshot(AssignedProfileState.Teams)
  public teamsFromState: ASSIGNED_PORTFOLIO_MODELS.Team[];

  @Select(ProfileState.skills)
  public skills$: Observable<ASSIGNED_PORTFOLIO_MODELS.Skill>;

  @Select(AssignedProfileState.filtrationSkills)
  public skillsSelected$: Observable<number>;

  @ViewSelectSnapshot(AssignedProfileState.departments)
  public department: ASSIGNED_PORTFOLIO_MODELS.Departments[];

  @ViewSelectSnapshot(AssignedProfileState.filtration)
  public filtration: ASSIGNED_PORTFOLIO_MODELS.AssignedProfileFiltrationModel;

  @Input() clientID;
  @Output() OpenModal = new EventEmitter<string>();
  ClientID: any;
  isNavigateToEdit = false

  public user: UserModel;

  public isClientNotSelected = true;
  public isPortfolioNotSelected = true;

  public cliendID: string;
  public PortfolioID: string;
  public teamID: string;
  public search: string;
  public status: number;
  public resetSearch = false;
  public isSkillsSelected = false;
  public isStatusSelected = false;
  public isContractSelected = false;
  public isDepartmentSelected = false;
  public isTeamSelected = false;
  public isPortfolioSelected = false;
  public isClientSelected = false;
  public isManagerSelected = false;


  public headInformation = {
    title: 'Team Association',
  };

  skillList = []

  /*_______________Task status filtration configs__________________*/

  public Status = ASSIGNED_PORTFOLIO_CONFIG.statusArray;
  StatusConfig: BasicSelectConfigModel = {
    placeholder: 'All',
    multiple: false,
    value: '',
  };

  public contractType = ASSIGNED_PORTFOLIO_CONFIG.contractTypeArray;
  contractTypeConfig: BasicSelectConfigModel = {
    placeholder: 'All',
    multiple: false,
    value: '',
  };

  departmentConfig: BasicSelectConfigModel = {
    placeholder: 'All',
    multiple: false,
    value: '',
  };

  public Client;
  public ClientConfig: BasicSelectConfigModel = {
    placeholder: 'All',
    multiple: false,
    value: '',
  };

  public Portfolio;
  public PortfolioConfig: BasicSelectConfigModel = {
    placeholder: 'All',
    multiple: false,
    value: '',
  };

  public Team;
  public TeamConfig: BasicSelectConfigModel = {
    placeholder: 'All',
    multiple: false,
    value: '',
  };

  public SkillsType;
  public SkillsTypeConfig: BasicSelectConfigModel = {
    placeholder: 'All',
    multiple: true,
    value: '',
  };

  isMobile: boolean;
  searchValue = null

  public managerFormControl = new FormControl()
  public filteredManagers = []

  constructor(
    private _headRefresher: HeadRefresherService,
    private _breakpointsObserver: BreakpointObserver,
    private _router: Router,
    private _route: ActivatedRoute,
    public dialog: MatDialog,
    private http: HttpService,
  ) {}

  @Dispatch() public _fireFilterAssignedProfileBySearchQuery(search: string) {
    return [
      new ASSIGNED_PORTFOLIO_ACTIONS.setFilters({
        searchQuery: search,
      }),
      new ASSIGNED_PORTFOLIO_ACTIONS.filterAssignedProfiles(),
    ];
  }

  @Dispatch() public getSkills(query: string) {
    return new PROFILE_ACTION.getSkills(query);
  }

  @Dispatch() public fireFilterBySkills(data: any) {
    this.isSkillsSelected = data && data.length > 0 ? true : false;
    if(!data || data.length === 0) this.skillList = []
    return [
      new ASSIGNED_PORTFOLIO_ACTIONS.setFilters({
        skillsIds: data,
      }),
      new ASSIGNED_PORTFOLIO_ACTIONS.filterAssignedProfiles(),
    ];
  }

  @Dispatch() public fireFilterOnLoad(data: any) {
   return [
      new ASSIGNED_PORTFOLIO_ACTIONS.setFilters({
        ...data
      }),
    ];
  }

  @Dispatch() public resetFiltersAndFireTable() {
    return [
      new ASSIGNED_PORTFOLIO_ACTIONS.resetFilters(),
      new ASSIGNED_PORTFOLIO_ACTIONS.getAllowedTeams({
        accountId: undefined,
        PortfolioId: undefined,
      }),
    ];
  }

  @Dispatch() public resetFilters() {
    return new ASSIGNED_PORTFOLIO_ACTIONS.resetFilters();
  }

  @Dispatch() public fireFilterByStatus(statusID: any) {
    this.isStatusSelected = statusID === '' ? false : true;
    this.StatusConfig = {...this.StatusConfig,value:statusID};
    if (statusID === '') {
      statusID = undefined;
    }
    return [
      new ASSIGNED_PORTFOLIO_ACTIONS.setFilters({
        status: statusID,
      }),
      new ASSIGNED_PORTFOLIO_ACTIONS.filterAssignedProfiles(),
    ];
  }

  @Dispatch() public fireFilterByContractType(contractID: any) {
    this.isContractSelected = contractID === '' ? false : true;
    this.contractTypeConfig = {...this.contractTypeConfig,value:contractID};
    if (contractID === '') {
      contractID = undefined;
    }
    return [
      new ASSIGNED_PORTFOLIO_ACTIONS.setFilters({
        contractType: contractID,
      }),
      new ASSIGNED_PORTFOLIO_ACTIONS.filterAssignedProfiles(),
    ];
  }

  @Dispatch() public fireFilterByDepartment(departmentID: any) {
    this.isDepartmentSelected = departmentID === '' ? false : true;
    this.departmentConfig = {...this.departmentConfig,value:departmentID};
    return [
      new ASSIGNED_PORTFOLIO_ACTIONS.setFilters({
        department: departmentID === '' ? undefined : +departmentID,
      }),
      new ASSIGNED_PORTFOLIO_ACTIONS.filterAssignedProfiles(),
    ];
  }

  @Dispatch() public fireFilterByManager(manager: any) {
    this.isManagerSelected = manager === '' ? false : true;
    if(manager === ''){
      this.managerFormControl.setValue(null)
    }
    return [
      new ASSIGNED_PORTFOLIO_ACTIONS.setFilters({
        assignedProfilesManagersIds: manager === '' ? undefined : [manager.id],
        assignedProfilesManagers: manager === '' ? undefined : [manager],
      }),
      new ASSIGNED_PORTFOLIO_ACTIONS.filterAssignedProfiles(),
    ];
  }

  @Dispatch() fireFilterByClient(clientId: string) {
    this.PortfolioConfig = { ...this.PortfolioConfig, value: '' };
    this.TeamConfig = { ...this.TeamConfig, value: '' };

    this.isClientSelected = clientId === '' ? false : true;
    this.ClientConfig = {...this.ClientConfig,value:clientId};


    let clientID = clientId;

    if (clientID === '') {
      clientID = undefined;
      this.isClientNotSelected = true;
      this.isPortfolioNotSelected = true;
      this.isPortfolioSelected = false;
      this.isTeamSelected = false;
    }

    else {
      this.isClientNotSelected = false;
    }


    this.ClientID = clientID;

    return [
      new ASSIGNED_PORTFOLIO_ACTIONS.getAllowedPortfolios(clientID),
      new ASSIGNED_PORTFOLIO_ACTIONS.getAllowedTeams({ accountId: clientID }),
    ];
  }

  @Dispatch() fireFilterByPortfolio(portfolioId: string) {
    this.TeamConfig = { ...this.TeamConfig, value: '' };
    this.isPortfolioSelected = portfolioId === '' ? false : true;
    this.PortfolioConfig = {...this.PortfolioConfig,value:portfolioId};


    if (portfolioId === '') {
      portfolioId = undefined;
      this.isPortfolioNotSelected = true;
      this.isTeamSelected = false;
      // this.Team = [{ id: '', name: 'All' }];
    }

     else {
       this.isPortfolioNotSelected = false;
     }

    return [
      new ASSIGNED_PORTFOLIO_ACTIONS.getAllowedTeams({
        PortfolioId: portfolioId,
        accountId: this.ClientID,
      }),
    ];
  }

  @Dispatch() fireFilterByTeam(teamId: string) {
    this.isTeamSelected = teamId === '' ? false : true;
    this.TeamConfig = {...this.TeamConfig,value:teamId};
    if (teamId === '') {
      const allTeamsIds = this.teamsFromState
        .filter((team) => team.id !== '')
        .map((team) => team.id);
      return [
        new ASSIGNED_PORTFOLIO_ACTIONS.setFilters({
          PlatformsIds: allTeamsIds,
          teamId: undefined
        }),
        new ASSIGNED_PORTFOLIO_ACTIONS.filterAssignedProfiles(),
      ];
    }
    return [
      new ASSIGNED_PORTFOLIO_ACTIONS.setFilters({
        PlatformsIds: [teamId],
        teamId: teamId
      }),
      new ASSIGNED_PORTFOLIO_ACTIONS.filterAssignedProfiles(),
    ];
  }

  @Dispatch() public fireImportTemplateExcel(){
    return new ASSIGNED_PORTFOLIO_ACTIONS.exportTemplateExcel();
  }

  @Dispatch() private getClients() {
    return new ASSIGNED_PORTFOLIO_ACTIONS.getAllClients();
  }

  @Dispatch() private getAllowedPortfolios(id: string) {
    return new ASSIGNED_PORTFOLIO_ACTIONS.getAllowedPortfolios(id);
  }

  @Dispatch() private getAllowedTeams(payload: ASSIGNED_PORTFOLIO_MODELS.GetMyTeamsFilteration, withPagination?: boolean) {
    return new ASSIGNED_PORTFOLIO_ACTIONS.getAllowedTeams(payload, withPagination);
  }
  @Dispatch() private _fireGetDepartments() {
    return new ASSIGNED_PORTFOLIO_ACTIONS.getDepartments();
  }

  @Dispatch() private _fireExportExcel() {
    return new ASSIGNED_PORTFOLIO_ACTIONS.exportExcel();
  }




  ngOnInit(): void {
    this.isMobile = this._breakpointsObserver.isMatched('(max-width: 768px)');

    this.refreshHeadInformation();
    this._fireGetDepartments();
    this.getSkills('');
    this.getClients();

    

    if(this.filtration){

      if(this.filtration.skillsIds?.length > 0){
        this.isSkillsSelected = true;
        this.skillList = [...this.filtration.skillsIds]
        }

        if(this.filtration.assignedProfilesManagersIds?.length > 0){
          this.isManagerSelected = true;
          this.managerFormControl.setValue(this.filtration.assignedProfilesManagers[0])
          }
      
      this.searchValue = this.filtration.searchQuery ? this.filtration.searchQuery : null
      

      if(this.filtration.department || this.filtration.department===0){
        this.isDepartmentSelected = true;
        this.departmentConfig = {...this.departmentConfig, value:this.filtration.department.toString()};
      } 

      if(this.filtration.status || this.filtration.status===0){
        this.isStatusSelected = true;
        this.StatusConfig = {...this.StatusConfig, value:this.filtration.status};
      } 

      if(this.filtration.contractType || this.filtration.contractType===0){
        this.isContractSelected = true;
        this.contractTypeConfig = {...this.contractTypeConfig, value:this.filtration.contractType};
      } 
      
      if(this.filtration.teamId){
        this.isTeamSelected = true;
        this.TeamConfig = {...this.TeamConfig,value:this.filtration.teamId};
        
        this.isClientSelected = true;
        this.isClientNotSelected = false;
        this.ClientConfig = {...this.ClientConfig,value:this.filtration.clientId};

        this.isPortfolioSelected = true;
        this.isPortfolioNotSelected = false;
        this.PortfolioConfig = {...this.PortfolioConfig,value:this.filtration.portfolioId};
        this.getAllowedTeams({
          PortfolioId: this.filtration.portfolioId,
          accountId: this.filtration.clientId,
          teamId: this.filtration.teamId,
          department: this.filtration.department || this.filtration.department===0 ? this.filtration.department : undefined,
          status: this.filtration.status || this.filtration.status===0 ? this.filtration.status : undefined,
          contractType: this.filtration.contractType || this.filtration.contractType===0 ? this.filtration.contractType : undefined
        }, true);
      }else{
        if(this.filtration.portfolioId){
          this.isPortfolioSelected = true;
          this.isPortfolioNotSelected = false;
          this.PortfolioConfig = {...this.PortfolioConfig,value:this.filtration.portfolioId};
          this.getAllowedTeams({
            PortfolioId: this.filtration.portfolioId,
            accountId: this.filtration.clientId,
            department: this.filtration.department || this.filtration.department===0 ? this.filtration.department : undefined,
            status: this.filtration.status || this.filtration.status===0 ? this.filtration.status : undefined,
            contractType: this.filtration.contractType || this.filtration.contractType===0 ? this.filtration.contractType : undefined  
          }, true);
        }else{
          
        if(this.filtration.clientId){
          this.isClientSelected = true;
          this.isClientNotSelected = false;
          this.ClientConfig = {...this.ClientConfig,value:this.filtration.clientId};
          this.getAllowedPortfolios(this.filtration.clientId);
          this.getAllowedTeams({accountId: this.filtration.clientId, department: this.filtration.department || this.filtration.department===0 ? this.filtration.department : undefined,
            status: this.filtration.status || this.filtration.status===0 ? this.filtration.status : undefined,
            contractType: this.filtration.contractType || this.filtration.contractType===0 ? this.filtration.contractType : undefined
         }, true);

        }else{
          this.getAllowedPortfolios(undefined);
          this.getAllowedTeams({department: this.filtration.department || this.filtration.department===0 ? this.filtration.department : undefined,
            status: this.filtration.status || this.filtration.status===0 ? this.filtration.status : undefined,
            contractType: this.filtration.contractType || this.filtration.contractType===0 ? this.filtration.contractType : undefined
         }, true);

        }
      }
      
    }

    
     
      
    }
   
    this._router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((event: NavigationStart) => {
        this.isNavigateToEdit = event.url.includes('/assigned-profiles/edit') ? true : false;
      })

      this.managerFormControl.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        // console.log('here', value);
        if (typeof value === 'string' && value.trim().length) {
          this.getAllManagers(value.trim());
        } else if (typeof value === 'string' && !value.trim().length) {
          this.filteredManagers = null;
        }
      });
  }

  resetFilter() {
      this.resetFiltersAndFireTable();
      this.resetSearch = !this.resetSearch;
      this.isSkillsSelected = false;
      this.isClientSelected = false;
      this.isPortfolioSelected = false;
      this.isTeamSelected = false;
      this.isStatusSelected = false;
      this.isClientNotSelected = true;
      this.isPortfolioNotSelected = true;
      this.isTeamSelected = false;
      this.isDepartmentSelected = false;
      this.isContractSelected = false;
      this.isManagerSelected = false;
      this.skillList = []

      this.ClientConfig = {...this.ClientConfig,value:''};
      this.PortfolioConfig = {...this.PortfolioConfig,value:''};
      this.TeamConfig = {...this.TeamConfig,value:''};
      this.StatusConfig = {...this.StatusConfig,value:''};
      this.departmentConfig = {...this.departmentConfig,value:''};
      this.contractTypeConfig = {...this.contractTypeConfig, value: ''}
      this.managerFormControl.setValue(null)
  }

  public refreshHeadInformation(): void {
    this._headRefresher.refresh(this.headInformation);
  }

  ngOnDestroy() {
    if(!this.isNavigateToEdit) this.resetFilters();
  }

  displayProfiles(object: any) {
    return object ? object.fullName : object;
  }

  getManager(value: any) {
    this.fireFilterByManager(value ? value : '')
  }

  getAllManagers(value: string) {
    this.http
      .fetch(
        `AssignedProfile/FindInternalAllowedAssignedProfilesManagers${buildQueryString({
          searchQuery: value,
        })}`
      )
      .subscribe((profiles) => {
        this.filteredManagers = profiles.result;
      });
  }

  assignProfile() {
    this._router.navigate(['create'], {
      relativeTo: this._route,
    });
  }

  fireFilterSkills(query: string) {
    this.getSkills(query);
  }

  public openUploadModal(){
    this.dialog.open(ModalUploadComponent, {
      width: '500px',
    });
  }

  public exportExcel(){
    this._fireExportExcel()
  }

  /*_________________________________________ACTIONS TRIGGERS_______________________________________*/
}
