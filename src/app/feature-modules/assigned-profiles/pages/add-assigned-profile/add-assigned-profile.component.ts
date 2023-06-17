import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpService } from './../../../../core/http/http/http.service';
import {
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { buildQueryString } from '@shared/helpers/build-query-string.helper';
import { DatePipe } from '@angular/common';
import * as ASSIGNED_PORTFOLIO_MODELS from '../../models/assigned-profile.model';
import * as ASSIGNED_PROFILE_ACTIONS from '../../state/assigned_profile.actions';
import { Select } from '@ngxs/store';
import { AssignedProfileState } from '@modules/assigned-profiles/state/assigned_profile.state';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BasicSelectConfigModel } from '@shared/modules/selects/model/selects.model';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import moment from 'moment';
import { HeadRefresherService } from '@core/services/head-refresher/head-refresher.service';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
@Component({
  selector: 'app-add-assigned-profile',
  templateUrl: './add-assigned-profile.component.html',
  styleUrls: ['./add-assigned-profile.component.scss'],
})
export class AddAssignedProfileComponent implements OnInit {
  @ViewChild('serviceAutoComplete', { read: MatAutocompleteTrigger }) serviceDescriptionRef: MatAutocompleteTrigger;
  @ViewChild('profileAutoComplete', { read: MatAutocompleteTrigger }) profileRef: MatAutocompleteTrigger;
  @ViewChild('managerAutoComplete', { read: MatAutocompleteTrigger }) managerRef: MatAutocompleteTrigger;
  @ViewChild('portfolioAutoComplete', { read: MatAutocompleteTrigger }) portfolioRef: MatAutocompleteTrigger;
  @ViewChild('platformAutoComplete', { read: MatAutocompleteTrigger }) platformRef: MatAutocompleteTrigger;
  @ViewChild('accountAutoComplete', { read: MatAutocompleteTrigger }) accountRef: MatAutocompleteTrigger;
  @ViewChild('poAutoComplete', { read: MatAutocompleteTrigger }) poRef: MatAutocompleteTrigger;
  


  @Select(AssignedProfileState.Clients) public clients$: Observable<
    ASSIGNED_PORTFOLIO_MODELS.Client[]
  >;

  @ViewSelectSnapshot(AssignedProfileState.departments)
  public departmentType: ASSIGNED_PORTFOLIO_MODELS.Departments[];
  public poNumberID:string = null;
  public associationID:string=null;
  // FormGroup
  assignedProfileForm: FormGroup;

  // Portfolio
  filteredPortfolios: any[];

  selectedProfile: any;
  selectedDepartment: string = '';

  showAvatar: boolean = false;
  // portfolioFormControl = new FormControl('');

  // Profile Image
  profileImage: string = '../../../../../assets/images/upload-image-avatar.svg';
  errorMsg: string;

  // Profile
  filteredProfiles: any[];
  filteredManagers: any[];

  filteredPOs: ASSIGNED_PORTFOLIO_MODELS.POModel[];

  // Client
  filteredClients: any[];
  imageTypes = ['image/png', 'image/jpeg', 'image/jpg'];

  contractTypeArray: any[] = [
    {
      id: 0,
      name: 'Billable',
    },
    {
      id: 1,
      name: 'Non-billable',
    },
  ];

  public headInformation = {
    title: 'Add New Associated Profile',
  };

  isBillable: boolean = true;

  // Team
  filteredTeams: any[];
  minDate: Date = new Date(moment().startOf('month').subtract(1, 'day').utc(false).format());
  public serviceEndDateMinDate: Date = new Date(moment().startOf('month').subtract(1, 'day').utc(false).format());

  hiringDate: any;
  leaveDateError = false;
  

  public contractType = this.contractTypeArray;
  public contractTypeConfig: BasicSelectConfigModel = {
    placeholder: 'All',
    multiple: false,
    value: 0,
  };

  public departmentTypeConfig: BasicSelectConfigModel = {
    placeholder: 'All',
    multiple: false,
    value: 0,
  };

  public rolesTypes;
  public allRolesTypes;
  
  // public rolesTypesConfig: BasicSelectConfigModel = {
  //   placeholder: 'All',
  //   multiple: false,
  //   value: "0",
  // };

  public locationTypes;
  public locationTypesConfig: BasicSelectConfigModel = {
    placeholder: 'All',
    multiple: false,
    value: "0",
  };

  public selectedPO: ASSIGNED_PORTFOLIO_MODELS.POModel = null;
  public clientInfo = {
    oldClientName: '',
    oldClientEmail: '',
    clientName:'Account',
  }

  constructor(
    private _headRefresher: HeadRefresherService,
    private fb: FormBuilder,
    private http: HttpService,
    private datepipe: DatePipe,
    private readonly _snacks: SnackBarsService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {
    this.assignedProfileForm = this.fb.group({
      PortfolioId: [''],
      FullName: ['', [Validators.required, Validators.maxLength(100)]],
      externalEmployeeEmail: ['', [Validators.email]],
      Title: ['', [Validators.required, Validators.maxLength(100)]],
      ProfileImage: [],
      ProfileImageLink: [],
      BillingRate: ['', [Validators.required, Validators.maxLength(6), Validators.pattern(/^[0-9]*$/),]],
      serviceStartDate: [new Date(), Validators.required],
      inheritStartDateFromPO: [true],
      serviceEndDate: [new Date(), [Validators.required]],
      inheritEndDateFromPO: [true],
      ProfileId: ['', Validators.required],
      ManagerId: ['', Validators.required],
      ClientId: [{ value: '', disabled: this.isBillable }, Validators.required],
      PlatformId: [{ value: '', disabled: this.isBillable }, Validators.required],
      clientFormControl: [{ value: '', disabled: this.isBillable }, Validators.required],
      profileFormControl: [{ value: '' }, Validators.required],
      portfolioFormControl: [{ value: '', disabled: this.isBillable }, Validators.required],
      teamFormControl: [{ value: '', disabled: this.isBillable }, Validators.required],
      managerFormControl: [{ value: '', disabled: this.isBillable }, Validators.required],
      poNumberFormControl: ['', [this.isBillable ? Validators.required : null]],
      pOId: ['', [this.isBillable ? Validators.required : null]],
      clientManagerName: [{ value: '', disabled: this.isBillable }, Validators.required],
      clientManagerEmail: [{ value: '', disabled: this.isBillable }, [Validators.email, Validators.required]],
      department: ['', Validators.required],
      ContractType: [0],
      Location: ["0"],
      Role: [''],
      roleFormControl: [''],
      notes: [''],
      removeImage: [false],
    });
  }

  @Dispatch() private _fireGetDepartments(platformId: string) {
    return new ASSIGNED_PROFILE_ACTIONS.GetDepartmentByPlatform(platformId);
  }

  ngOnInit(): void {
    this.poNumberID = this._activatedRoute.snapshot.queryParamMap.get('po');
    this.associationID = this._activatedRoute.snapshot.queryParamMap.get('association');

    if(this.poNumberID){
      this.handlePONumber()
    }
    if(this.associationID){
      this.getAssociationProfile(this.associationID);
      this.headInformation.title = "Clone Association"
    this.refreshHeadInformation();
      
    }
   
    window.addEventListener('scroll', this._scrollEvent, true);
    this.getAllLocations();
    this.getAllRoles();
    this.getAllProfiles('');
    this.refreshHeadInformation();

    this.assignedProfileForm.get('clientFormControl').valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe((value) => {
      const clientId = this.assignedProfileForm.get('ClientId').value;
      if(clientId){
        this.getAllPortfolios(clientId);
      }
      if(typeof value === 'string' && value.trim().length){
          this.getAllClients(value);
        }else {
          this.getAllClients('');
      }

    });

    this.assignedProfileForm
      .get('portfolioFormControl')
      .valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        const clientId = this.assignedProfileForm.get('ClientId').value;
        const portfolioId = this.assignedProfileForm.get('PortfolioId').value;
        if (portfolioId) {
          this.getAllTeams(portfolioId);
        } else if (typeof value === 'string' && value.trim().length) {
          this.searchAllPortfolios(clientId, value);
        } else if (typeof value === 'string' && !value.trim().length) {
          this.searchAllPortfolios(clientId, '');
        } else {
          // mnaguib will never enter here
          this.assignedProfileForm.controls.PlatformId.setValue('');
          this.filteredTeams = null;
        }
      });

    this.assignedProfileForm
      .get('teamFormControl')
      .valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        const portfolioId = this.assignedProfileForm.get('PortfolioId').value;
        if (typeof value === 'string' && value.trim().length) {
          this.getAllTeams(portfolioId, value);
        }else {
          this.getAllTeams(portfolioId, '');
        }
      });

    this.assignedProfileForm
      .get('PlatformId')
      .valueChanges.subscribe((value) => {
        if (value) {
          this._fireGetDepartments(value);
        }
      });

    this.assignedProfileForm
      .get('profileFormControl')
      .valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        if (typeof value === 'string' && value.trim().length) {
          this.getAllProfiles(value);
        } else if (typeof value === 'string' && !value.trim().length) {
          this.getAllProfiles('');
        }
        // mnaguib till here
        this.assignedProfileForm.controls.FullName.setValue(value.fullName);
        if(value.profileImageLink){
          this.profileImage = value.profileImageLink
          this.assignedProfileForm.controls.ProfileImageLink.setValue(
            value.profileImageLink
          );
          this.assignedProfileForm.controls.ProfileImage.setValue(
            value.profileImageLink
          );
        }
        this.assignedProfileForm.controls.Title.setValue(value.title);
      });

    this.assignedProfileForm
      .get('roleFormControl')
      .valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        if (typeof value === 'string' && value.trim().length) {
          this.rolesTypes = this.allRolesTypes.filter((x) => x.name.toLowerCase().includes(value.toLowerCase()))
        } else if (typeof value === 'string' && !value.trim().length) {
          this.rolesTypes = [...this.allRolesTypes];
        }

      });

    this.assignedProfileForm
      .get('managerFormControl')
      .valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        if (typeof value === 'string' && value.trim().length) {
          this.getAllManagers(value.trim());
        } else if (typeof value === 'string' && !value.trim().length) {
          this.getAllManagers(value);
        }
      });
    // this.assignedProfileForm
    //   .get('ManagerId')
    //   .valueChanges.subscribe((value) => {
    //     if (value === this.assignedProfileForm.controls.ProfileId.value) {
    //       this.assignedProfileForm.controls.managerFormControl.setValue('');
    //       // this.assignedProfileForm.controls.ManagerId.setValue('');
    //     }
    //   });
    this.assignedProfileForm
      .get('serviceStartDate')
      .valueChanges.subscribe((value) => {
        const date = new Date(value);
        date.setDate(date.getDate() + 1);
        this.hiringDate = date;
      });
      if(!this.poNumberID){
        this.assignedProfileForm
          .get('poNumberFormControl')
          .valueChanges.pipe(debounceTime(500), startWith(''), distinctUntilChanged())
          .subscribe((value) => {
            if (typeof value === 'string' && value.trim().length) {
              this.findAllowedPOs(value.trim());
            } else if (typeof value === 'string' && !value.trim().length) {
              this.findAllowedPOs("");
            }
          });
      }
    
      
  }

  public refreshHeadInformation(): void {
    this._headRefresher.refresh(this.headInformation);
  }

  setDepartment(data: number) {
    this.assignedProfileForm.controls.department.setValue(data);
  }

  setLocation(data: number) {
    this.assignedProfileForm.controls.Location.setValue(data);
  }

  setRole(data: number) {
    this.assignedProfileForm.controls.Role.setValue(data);
  }

  public validateAutoCompleteFormControl(event, formControl: string) {
    if (!(this.assignedProfileForm.controls[formControl].value && event.value)) {
      this.assignedProfileForm.controls[formControl].markAsTouched();
    }
    if (event.value) {
      switch (formControl) {
        case 'pOId':
          if (!this.assignedProfileForm.controls[formControl].value) this.assignedProfileForm.get('poNumberFormControl').setErrors({ notSelected: true })
          break;
      }
    }
  }

  public clearPONumberValue(ev: any): void {
    ev.stopPropagation();
    this.assignedProfileForm.controls.pOId.setValue('');
    this.assignedProfileForm.controls.poNumberFormControl.setValue('');
    this.filteredPOs = null;
    this.selectedPO = null;
    this.poRef._handleFocus();
    this.filteredManagers = null;
    this.clearAccountValue();
    this.selectedDepartment = '';
    // Manager Name
    this.formControls.managerFormControl.setValue('');
    this.formControls.ManagerId.setValue(null);
    this.assignedProfileForm.controls.department.setValue('');

    //Client Manage Name & Email
    this.formControls.clientManagerName.setValue('');
    this.formControls.clientManagerEmail.setValue('');
    this.departmentTypeConfig = { ...this.departmentTypeConfig, value: 0 };
    this.selectedDepartment = '';
    //Service Start Date
    this.formControls.serviceStartDate.setValue(null);
    this.formControls.serviceStartDate.enable();
    //Service End Date
    this.formControls.serviceEndDate.setValue(null)
    this.formControls.serviceEndDate.enable();
  }

  public clearAccountValue(ev?: any) {
    if(ev){
      ev.stopPropagation();
      this.accountRef._handleFocus();
    }
    this.assignedProfileForm.controls.ClientId.setValue('');
    this.assignedProfileForm.controls.clientFormControl.setValue('');
    this.assignedProfileForm.controls.portfolioFormControl.setValue('');
    this.clientInfo.clientName = 'Account';
    this.assignedProfileForm.controls.PortfolioId.setValue('');
    this.assignedProfileForm.controls.teamFormControl.setValue('');
    this.assignedProfileForm.controls.PlatformId.setValue('');
    this.departmentTypeConfig = { ...this.departmentTypeConfig, value: 0 };
    this.assignedProfileForm.controls.department.setValue('');
    this.filteredClients = null;
    this.filteredPortfolios = null;
    this.filteredTeams = null;
    
  }

  public changeBillableFields(): void {
    const formControlNames = ['department', 'clientFormControl', 'ClientId', 'portfolioFormControl', 'PortfolioId', 'teamFormControl', 'PlatformId', 'managerFormControl', 'ManagerId', 'clientManagerName', 'clientManagerEmail'];
    formControlNames.map(formControl => {
      if (this.isBillable) {
        this.assignedProfileForm.get([formControl]).disable();
      } else {
        this.assignedProfileForm.get([formControl]).enable();
      }

    })
  }

  public onChangeServiceStartDate(event): void {
    if (this.selectedPO) {
      if (moment(event).utc(false).isBefore(this.selectedPO.startDate)) {
        this.formControls.serviceStartDate.setErrors({ 'beforePo': true });
        this.formControls.serviceStartDate.setValue(null)

      } else {
        this.formControls.serviceStartDate.setErrors({ 'beforePo': false });
        this.formControls.serviceStartDate.setValue(moment(event).utc(false).format())
      }
    } else {
      this.formControls.serviceStartDate.setValue(moment(event).utc(false).format())
    }
    this.serviceEndDateMinDate = new Date(moment(event).hours(0).minutes(0).utc(false).format());
    if (moment(event).utc(false).isAfter(new Date(this.formControls.serviceEndDate.value).toISOString())) {
      this.formControls.serviceEndDate.setValue(null);
      this.formControls.serviceEndDate.enable();
      this.formControls.inheritEndDateFromPO.setValue(false);

    }

  }

  public setContractType(data: number): void {
    const pOId = this.assignedProfileForm.get('pOId');
    const poNumberFormControl = this.assignedProfileForm.get('poNumberFormControl')
    const billingRate = this.assignedProfileForm.get('BillingRate');
    const inheritStartDateFromPO = this.assignedProfileForm.get('inheritStartDateFromPO');
    const inheritEndDateFromPO = this.assignedProfileForm.get('inheritEndDateFromPO');
    const serviceEndDate = this.assignedProfileForm.get('serviceEndDate')
    const serviceStartDate = this.assignedProfileForm.get('serviceStartDate')
    switch (data) {
      case 0:
          this.isBillable = true;
          if(this.assignedProfileForm.controls.poNumberFormControl.value){
            this.clientInfo.oldClientName = this.assignedProfileForm.controls.clientManagerName.value;
            this.clientInfo.oldClientEmail = this.assignedProfileForm.controls.clientManagerEmail.value;
            this.assignedProfileForm.controls.clientManagerName.setValue(this.clientInfo.oldClientName + '(' + this.assignedProfileForm.controls.clientManagerEmail.value + ')');
          }else{
            this.assignedProfileForm.controls.clientManagerName.setValue('');
          }
          if(!this.poNumberID && !this.associationID){
            pOId.enable();
            pOId.setValue(null);
            poNumberFormControl.setValue(null);
            this.selectedPO = null;
            poNumberFormControl.setValidators([Validators.required]);
            inheritStartDateFromPO.setValue(true);
            inheritEndDateFromPO.setValue(true);
            if (this.selectedPO) {
              serviceStartDate.setValue(this.selectedPO.startDate)
              serviceStartDate.disable();
              serviceEndDate.setValue(this.selectedPO.endDate)
              serviceEndDate.disable();
            }
          }
          billingRate.enable();
        break;
      case 1:
        this.isBillable = false;
        this.assignedProfileForm.controls.clientManagerName.setValue(this.clientInfo.oldClientName);
        this.assignedProfileForm.controls.clientManagerEmail.setValue(this.clientInfo.oldClientEmail);
        pOId.disable();
        billingRate.disable();
        poNumberFormControl.clearValidators();
        inheritEndDateFromPO.setValue(false);
        inheritStartDateFromPO.setValue(false);
        serviceEndDate.enable();
        serviceStartDate.enable();
        serviceStartDate.setValue(new Date(moment().startOf('month').utc(false).format()))
        serviceEndDate.setValue(new Date(moment().startOf('month').utc(false).format()))
        // poNumberFormControl.disable();

        break;

      default:
        break;

    }
    poNumberFormControl.updateValueAndValidity();
    this.changeBillableFields();
    this.assignedProfileForm.controls.ContractType.setValue(data);
  }
  public deleteProfileImage() {
    this.showAvatar = !this.showAvatar;
    if(!this.showAvatar && this.assignedProfileForm.controls.ProfileImage.value){
      this.profileImage = this.assignedProfileForm.controls.ProfileImage.value;
      this.formControls.removeImage.setValue(false);
    }else {
      this.profileImage = '../../../../../assets/images/upload-image-avatar.svg'; 
      this.formControls.removeImage.setValue(true);
    }
  }

  public clearRoleValue(ev: any) {
    ev.stopPropagation();
    this.assignedProfileForm.controls.Role.setValue('');
    this.assignedProfileForm.controls.roleFormControl.setValue('');
    this.serviceDescriptionRef._handleFocus();
  }

  public clearManagerValue(ev: any){
    ev.stopPropagation();
    this.assignedProfileForm.controls.ManagerId.setValue('');
    this.assignedProfileForm.controls.managerFormControl.setValue('');
    this.filteredManagers = null;
    this.managerRef._handleFocus();
  }

  public clearPortfolioValue(ev: any) {
    ev.stopPropagation();
    this.assignedProfileForm.controls.PortfolioId.setValue('');
    this.assignedProfileForm.controls.portfolioFormControl.setValue('');
    this.assignedProfileForm.controls.teamFormControl.setValue('');
    this.assignedProfileForm.controls.PlatformId.setValue('');
    this.departmentTypeConfig = { ...this.departmentTypeConfig, value: 0 };
    this.assignedProfileForm.controls.department.setValue('');
    this.filteredTeams = null;
    this.portfolioRef._handleFocus();
  }

  public clearPlatformValue(ev: any){
    ev.stopPropagation();
    this.assignedProfileForm.controls.PlatformId.setValue('');
    this.assignedProfileForm.controls.teamFormControl.setValue('');
    this.departmentTypeConfig = { ...this.departmentTypeConfig, value: 0 };
    this.assignedProfileForm.controls.department.setValue('');
    this.platformRef._handleFocus();
  }


  public clearProfileValue(ev: any) {
    ev.stopPropagation();
    this.assignedProfileForm.controls.ProfileId.setValue('');
    this.assignedProfileForm.controls.profileFormControl.setValue('');
    this.assignedProfileForm.controls.Title.setValue('');
    this.assignedProfileForm.controls.FullName.setValue('');
    this.assignedProfileForm.controls.ProfileImage.setValue('');
    this.profileRef._handleFocus();
    this.profileImage = '../../../../../assets/images/upload-image-avatar.svg';
    
  }
  // Get Portfolios Data
  getAllPortfolios(value: string) {
    this.http
      .fetch(
        `AssignedProfile/GetMyInvolvedPortfolios${buildQueryString({
          accountId: value,
        })}`
      )
      .subscribe((result) => {
        this.filteredPortfolios = result.result;
      });
  }

  searchAllPortfolios(value: string, search: string) {
    this.http
      .fetch(
        `AssignedProfile/GetMyInvolvedPortfolios${buildQueryString({
          accountId: value,
          query: search,
        })}`
      )
      .subscribe((result) => {
        this.filteredPortfolios = result.result;
      });
  }

  // Get Profiles Data
  getAllProfiles(value: string) {
    this.http
      .fetch(
        `Profile/FindUnassignedEmployees${buildQueryString({
          query: value,
        })}`
      )
      .subscribe((profiles) => {
        this.filteredProfiles = profiles.result;
      });
  }

  getAllManagers(value: string) {
    this.http
      .fetch(
        `Profile/Find${buildQueryString({
          query: value,
          profileType: 1,
        })}`
      )
      .subscribe((profiles) => {
        this.filteredManagers = profiles.result;
      });
  }

  // Get Clients Data
  getAllClients(value: string) {
    this.http
      .fetch(
        `AssignedProfile/GetMyInvolvedAccounts${buildQueryString({
          query: value,
        })}`
      )
      .subscribe((clients) => {
        this.filteredClients = clients.result;
      });
  }

  // Get Teams Data

  getAllTeams(value: string, query?: string) {
    this.http
      .fetch(
        `AssignedProfile/GetMyInvolvedPlatforms${buildQueryString({
          PortfolioId: value,
          query
        })}`
      )
      .subscribe((result) => {
        this.filteredTeams = result.result;
      });
  }

  searchAllTeams(value: string, query: string) {
    this.http
      .fetch(
        `AssignedProfile/GetMyallowedPlatforms${buildQueryString({
          PortfolioId: value,
          query,
        })}`
      )
      .subscribe((result) => {
        this.filteredTeams = result.result;
      });
  }


  getAllRoles() {
    this.http.fetch(`Lookup/GetAssignedProfileRoles`).subscribe((roles) => {
      this.allRolesTypes = roles.result;
      this.rolesTypes = roles.result;
    });
  }

  getAllLocations() {
    this.http.fetch(`Lookup/GetLocations`).subscribe((locations) => {
      this.locationTypes = locations.result;
    });
  }

  public findAllowedPOs(searchQuery: string) {
    this.http.post(`PO/FindMyAllowedPOs`, { searchQuery }).subscribe((res) => {
      this.filteredPOs = res.result;
    })
  }

  // Display name of the object in auto complete
  displayFunction(object: any) {
    return object ? object.name : object;
  }

  displayProfiles(object: any) {
    return object ? object.fullName : object;
  }

  displayRole(object: any) {
    return object ? object.name : object;
  }

  public displayPONumbers(object: any) {
    return object ? object.number : object;
  }

  // Set ID to the form control
  getTeam(value: any) {
    this.assignedProfileForm.controls.PlatformId.setValue(value.id);
    this.assignedProfileForm.controls.teamFormControl.setValue(value.name);
  }

  getProfile(value: any) {
    this.assignedProfileForm.controls.ProfileId.setValue(value.id);
  }

  getRole(value: any) {
    this.assignedProfileForm.controls.Role.setValue(value.id);
  }

  getPortfolio(value: any) {
    this.formControls.portfolioFormControl.setValue(value.name)
    this.assignedProfileForm.controls.PortfolioId.setValue(value.id);
  }

  getClient(value: any) {
    this.formControls.clientFormControl.patchValue(value.name)
    this.assignedProfileForm.controls.ClientId.setValue(value.id);
  }

  getManager(value: any) {
    this.formControls.managerFormControl.setValue(value.fullName)
    this.assignedProfileForm.controls.ManagerId.setValue(value.id);
  }

  public onSelectPO(value: ASSIGNED_PORTFOLIO_MODELS.POModel): void {
    this.selectedPO = value;
    this.formControls.pOId.setValue(value.id);
    //Account Form Fields
    this.clientInfo.clientName = value?.platform?.portfolio?.account?.name;
    this.formControls.clientFormControl.patchValue(value?.platform?.portfolio?.account?.name)
    this.formControls.ClientId.setValue(value?.platform?.portfolio?.account?.id);;
    //Portfolio Form Fields
    this.formControls.portfolioFormControl.setValue(value?.platform?.portfolio?.name);
    this.formControls.PortfolioId.setValue(value?.platform?.portfolio?.id);

    //Platform Form Fields
    this.formControls.PlatformId.setValue(value?.platform?.id);
    this.formControls.teamFormControl.setValue(value?.platform?.name);

    //Department Form Field
    this.assignedProfileForm.controls.department.setValue(value?.department?.id);
    this.departmentTypeConfig = { ...this.departmentTypeConfig, value: value?.department?.id };
    this.selectedDepartment = value?.department?.name;
    

    // Manager Name
    this.formControls.managerFormControl.setValue(value.manager.name);
    this.formControls.ManagerId.setValue(value?.manager?.id)
    //Client Manage Name & Email
    this.clientInfo.oldClientName = value?.partnerName;
    this.clientInfo.oldClientEmail = value?.partnerEmail;
    if (!this.formControls.ContractType.value) {
      this.formControls.clientManagerName.setValue(`${value?.partnerName}(${value?.partnerEmail})`);
    } else {
      this.formControls.clientManagerName.setValue(value?.partnerName);
    }
    this.formControls.clientManagerEmail.setValue(value?.partnerEmail);
    let beginningOfMonth = moment().startOf('month').utc(false).format();
    //Service Start Date
    // if (this.formControls.inheritStartDateFromPO.value) {
    //   this.formControls.serviceStartDate.setValue(new Date(value.startDate));
    //   this.formControls.serviceStartDate.disable();
    // }
    if (moment(value.startDate).isBefore(beginningOfMonth)) {
      this.formControls.inheritStartDateFromPO.setValue(false)
      this.formControls.inheritStartDateFromPO.disable()
    }
    else {
      this.formControls.serviceStartDate.setValue(new Date(value.startDate));
      this.formControls.serviceStartDate.disable();
      this.formControls.inheritStartDateFromPO.setValue(true)
      this.formControls.inheritStartDateFromPO.enable();
    }
    //Service End Date
    if (this.formControls.inheritEndDateFromPO.value) {
      this.formControls.serviceEndDate.setValue(new Date(value.endDate))
      this.formControls.serviceEndDate.disable();
    }
  }

  public onChangeInheritDate(value: boolean, formControl: string): void {
    if (formControl === 'serviceStartDate') {
      if (value && this.selectedPO) {
        this.formControls.serviceStartDate.setValue(new Date(this.selectedPO.startDate))
        this.formControls.serviceStartDate.disable();
      } else {
        this.formControls.serviceStartDate.setValue(moment().hours(0).minutes(0).milliseconds(0).utc(false).format())
        this.formControls.serviceStartDate.enable();
      }
      this.minDate = new Date(moment().startOf('month').utc(false).format())
    }
    if (formControl === 'serviceEndDate') {
      if (value && this.selectedPO) {
        this.formControls.serviceEndDate.setValue(new Date(this.selectedPO.endDate))
        this.formControls.serviceEndDate.disable();
      } else {
        this.formControls.serviceEndDate.setValue(moment().hours(0).minutes(0).milliseconds(0).utc(false).format())
        this.formControls.serviceEndDate.enable();
      }
      this.serviceEndDateMinDate = this.formControls.serviceEndDate.value
    }
  }

  getSelectedProfile(profile: any) {
    this.selectedProfile = profile;
  }

  get formControls() {
    return this.assignedProfileForm.controls;
  }
  uploadProfileImage(event: Event) {
    // this.AddClientForm.controls.image.setValue('');
    this.errorMsg = '';
    const target = event.target as HTMLInputElement;
    if (this.imageTypes.indexOf(target.files[0].type) === -1) {
      this.errorMsg = 'Invalid Image Type';
    } else if (target.files[0].size <= 8000000) {
      this.assignedProfileForm.controls.ProfileImage.setValue(target.files[0]);
    } else {
      this.errorMsg = 'Max size is 8 MB';
      this.profileImage = ''
    }
  }

  onFileChanges(event: Event) {
    if (
      event[0].size <= 8000000 &&
      this.imageTypes.indexOf(event[0].type) !== -1
    ) {
      this.profileImage = event[0].base64;
    }
  }

  submitAssignedForm() {

    if (!this.isBillable) {
      // this.assignedProfileForm.controls.pOId.setValue(null);
      this.assignedProfileForm.controls.BillingRate.setValue('');
    }
    if (this.isBillable) {
      this.assignedProfileForm.controls.clientManagerName.setValue(this.clientInfo.oldClientName);
      this.assignedProfileForm.controls.clientManagerEmail.setValue(this.clientInfo.oldClientEmail);
    }

    const formData = new FormData();

    for (var key in this.assignedProfileForm.getRawValue()) {
      if (key === 'serviceStartDate' || key === 'serviceEndDate') {
        formData.append(
          key,
          this.assignedProfileForm.get(key).value
            ? this.datepipe.transform(
              this.assignedProfileForm.get(key).value,
              'yyyy-MM-dd'
            )
            : ''
        );
      } else if (key === 'BillingRate') {
        const BillingRate = this.assignedProfileForm.controls.BillingRate.value;
        // mnaguib why
        formData.append('BillingRate', BillingRate as Blob);
      } else {
        formData.append(
          key,
          this.assignedProfileForm.get(key).value &&
            typeof this.assignedProfileForm.get(key).value === 'string'
            ? this.assignedProfileForm.get(key).value.trim()
            : this.assignedProfileForm.get(key).value
        );
      }
    }

    this.http.post('AssignedProfile/Create', formData).subscribe((data) => {
      if (!data.errorMessage) {
        this._snacks.openSuccessSnackbar({
          message: `${this.assignedProfileForm.controls.FullName.value} has been assigned`,
        });
        this._router.navigate(['assigned-profiles'], {});
      } else {
        this._snacks.openFailureSnackbar({
          message: data.errorMessage,
        });
      }
    });
  }

  setClientName(clientObject: any) {
    this.clientInfo.clientName = clientObject.name;
  }
  public handlePONumber(): void{
    
    this.findAllowedPOs('');
    setTimeout(() => {
      this.selectedPO = this.filteredPOs.find(item=> item.id === this.poNumberID);
      this.onSelectPO(this.selectedPO);
      this.formControls.poNumberFormControl.setValue(this.selectedPO?.number);
    }, 600);

  }

  private _scrollEvent = (): void => {
    if(this.serviceDescriptionRef?.panelOpen){
      this.serviceDescriptionRef?.updatePosition();
    }else if(this.profileRef?.panelOpen){
      this.profileRef?.updatePosition();
    }else if(this.managerRef?.panelOpen){
      this.managerRef?.updatePosition();
    }else if(this.portfolioRef?.panelOpen){
      this.portfolioRef?.updatePosition();
    }else if(this.platformRef?.panelOpen){
      this.platformRef?.updatePosition();
    }else if(this.accountRef?.panelOpen){
      this.accountRef?.updatePosition();
    }else if(this.poRef?.panelOpen){
      this.poRef?.updatePosition();
    }

  }

  getAssociationProfile(value: string) {
    this.http
      .fetch(
        `AssignedProfile/GetById${buildQueryString({
          id: value,
        })}`
      )
      .subscribe(({ result }) => {
      this.onSelectPO(result?.po);
      this.formControls.poNumberFormControl.setValue(result?.po);
      this.assignedProfileForm.controls["poNumberFormControl"].markAsTouched();
        this.assignedProfileForm.patchValue({
          FullName: result.fullName,
          externalEmployeeEmail: result.externalEmployeeEmail ? result.externalEmployeeEmail : '',
          Title: result.title,
          profileFormControl: result.profile,
          ProfileId: result.profile.id,
          ManagerProfileId: result.manager.id,
          teamId: result.platform.id,
          BillingRate: result.billingRate,
          serviceStartDate: result.serviceStartDate,
          serviceEndDate: result.serviceEndDate,

          ContractType: result.contractType,
          Location: result.location.id,
          Role: result.role.id,
          roleFormControl: result.role,
          notes: result?.notes ? result.notes : '',
          inheritEndDateFromPO: result?.inheritEndDateFromPO,

        });
       
        if (moment(this.formControls.serviceStartDate.value).isSameOrBefore(this.minDate)) {
          this.formControls.serviceStartDate.setErrors({ 'startDateNotInBillingCycle': true });
          this.assignedProfileForm.controls["serviceStartDate"].markAsTouched();
        }
        if(!result.profileImageLink.includes('avatar-1577909.svg')){
          this.profileImage = result.profileImageLink;
        }
       
        this.contractTypeConfig = {
          ...this.contractTypeConfig,
          value: result.contractType,
        };
      });

  }
}
