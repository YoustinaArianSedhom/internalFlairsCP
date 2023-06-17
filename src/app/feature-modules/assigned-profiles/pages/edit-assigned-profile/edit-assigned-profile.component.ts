import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpService } from './../../../../core/http/http/http.service';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { buildQueryString } from '@shared/helpers/build-query-string.helper';
import { DatePipe } from '@angular/common';
import * as ASSIGNED_PORTFOLIO_MODELS from '../../models/assigned-profile.model';
import * as ASSIGNED_PROFILE_ACTIONS from '../../state/assigned_profile.actions';
import { Select } from '@ngxs/store';
import { AssignedProfileState } from '@modules/assigned-profiles/state/assigned_profile.state';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BasicSelectConfigModel } from '@shared/modules/selects/model/selects.model';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import moment from 'moment';
import { HeadRefresherService } from '@core/services/head-refresher/head-refresher.service';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'app-edit-assigned-profile',
  templateUrl: './edit-assigned-profile.component.html',
  styleUrls: ['./edit-assigned-profile.component.scss'],
})
export class EditAssignedProfileComponent implements OnInit {
  @ViewChild('serviceAutoComplete', { read: MatAutocompleteTrigger }) serviceDescriptionRef: MatAutocompleteTrigger;
  @ViewChild('managerAutoComplete', { read: MatAutocompleteTrigger }) managerRef: MatAutocompleteTrigger;
  @ViewChild('portfolioAutoComplete', { read: MatAutocompleteTrigger }) portfolioRef: MatAutocompleteTrigger;
  @ViewChild('platformAutoComplete', { read: MatAutocompleteTrigger }) platformRef: MatAutocompleteTrigger;
  @ViewChild('accountAutoComplete', { read: MatAutocompleteTrigger }) accountRef: MatAutocompleteTrigger;

  @Select(AssignedProfileState.Clients) public clients$: Observable<
    ASSIGNED_PORTFOLIO_MODELS.Client[]
  >;

  @ViewSelectSnapshot(AssignedProfileState.departments)
  public departmentType: ASSIGNED_PORTFOLIO_MODELS.Departments[];

  public ManagerControl = new FormControl();

  public headInformation = {
    title: 'Edit Associated Profile',
  };
  public hideToggleIcon:boolean = true;

  // FormGroup
  assignedProfileForm: FormGroup;

  // Portfolio
  filteredPortfolios: any[];

  editedProfile: any;
  selectedDepartment: string;

  imageTypes = ['image/png', 'image/jpeg', 'image/jpg'];

  selectedProfile: any;
  // portfolioFormControl = new FormControl('');

  // Profile Image
  public profileImage: string = '../../../../../assets/images/upload-image-avatar.svg';
  public showAvatar: boolean = false;
  errorMsg: string;

  // Profile
  filteredProfiles: any[];
  filteredManagers: any[];

  // Client
  filteredClients: any[];

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

  isBillable: boolean = true;
  filteredStatus: Observable<any[]>;
  statusFormControl = new FormControl('');

  StatusID: any;

  hiringDate: any;
  leaveDateError = false;
  clientName = 'Account';

  // Team
  filteredTeams: any[];
  minDate: Date;
  public serviceEndDateMinDate: Date = new Date(moment().startOf('month').subtract(1,'day').utc(false).format());
  public selectedPO: ASSIGNED_PORTFOLIO_MODELS.POModel = null;

  isUserStartTypeInManagerField = false;
  isUserStartTypeInClientField = false;
  isUserStartTypeInPortfolioField = false;
  isUserStartTypeInTeamField = false;

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
  public rolesTypesConfig: BasicSelectConfigModel = {
    placeholder: 'All',
    multiple: false,
    value: 0,
  };

  public locationTypes;
  public locationTypesConfig: BasicSelectConfigModel = {
    placeholder: 'All',
    multiple: false,
    value: 0,
  };

  constructor(
    private _headRefresher: HeadRefresherService,
    private fb: FormBuilder,
    private http: HttpService,
    private datepipe: DatePipe,
    private readonly _snacks: SnackBarsService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.assignedProfileForm = this.fb.group({
      PortfolioId: [''],
      FullName: ['', [Validators.required, Validators.maxLength(100)]],
      externalEmployeeEmail: ['', [Validators.email]],
      Title: ['', [Validators.required, Validators.maxLength(100)]],
      ProfileImage: [],
      ProfileImageLink: [],
      BillingRate: [
        '',
        [
          Validators.required,
          Validators.maxLength(6),
          Validators.pattern(/^[0-9]*$/),
        ],
      ],
      serviceStartDate: ['', Validators.required],
      inheritStartDateFromPO: [false],
      serviceEndDate: ['', [Validators.required]],
      inheritEndDateFromPO: [false],
      ProfileId: ['', Validators.required],
      ManagerProfileId: ['', Validators.required],
      ClientId: ['', Validators.required],
      teamId: ['', Validators.required],
      clientFormControl: ['', Validators.required],
      profileFormControl: ['', Validators.required],
      portfolioFormControl: ['', Validators.required],
      teamFormControl: ['', Validators.required],
      managerFormControl: ['', Validators.required],
      removeImage: [false],
      PONumber: [{ value: '', disabled: true }, Validators.maxLength(100)],
      clientManagerName: ['', [Validators.required]],
      clientManagerEmail: ['', [Validators.email, Validators.required]],
      department: ['', Validators.required],
      ContractType: [{ value: null, disabled: true }],
      Location: [null],
      Role: [null],
      roleFormControl: [null],
      notes: [''],
    });
    // const currentYear = new Date().getFullYear();
    // mnaguib check
    // this.minDate = new Date(currentYear - 21, 0, 1);
  }

  @Dispatch() private _fireGetDepartments(platformId: string) {
    return new ASSIGNED_PROFILE_ACTIONS.GetDepartmentByPlatform(platformId);
  }

  ngOnInit(): void {
    window.addEventListener('scroll', this._scrollEvent, true);
    this._headRefresher.refresh(this.headInformation);
    this._route.params.subscribe((params: Params) => {
      const profileID = params.id;
      this.getEditedProfile(profileID);
    });
    this.getAllLocations();
    this.getAllRoles();
    this.assignedProfileForm
      .get('portfolioFormControl')
      .valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        this.isUserStartTypeInPortfolioField = true;
        const clientId = this.assignedProfileForm.get('ClientId').value;
        const portfolioId = this.assignedProfileForm.get('PortfolioId').value;
        if (portfolioId) {
          this.getAllTeams(portfolioId);
        } else if (typeof value === 'string' && value.trim().length) {
          this.searchAllPortfolios(clientId, value);
        } else if (typeof value === 'string' && !value.trim().length) {
          this.searchAllPortfolios(clientId, '');
        } else {
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

    this.assignedProfileForm.get('teamId').valueChanges.subscribe((value) => {
      if (value) {
        this._fireGetDepartments(value);
      }
    });

    this.assignedProfileForm
      .get('profileFormControl')
      .valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        if (value !== '') {
          this.getAllProfiles(value);
          this.assignedProfileForm.controls.ProfileImageLink.setValue(
            value.profileImageLink
          );
          this.assignedProfileForm.controls.ProfileImage.setValue(
            value.profileImageLink
          );
          this.assignedProfileForm.controls.removeImage.setValue(value?.removeImage ? value.removeImage : false)
        }
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
      .get('clientFormControl')
      .valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        this.isUserStartTypeInClientField = true;
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
      .get('managerFormControl')
      .valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        this.isUserStartTypeInManagerField = true;
        if (typeof value === 'string') {
          this.getAllManagers(value);
        } 
      });

    // this.assignedProfileForm
    //   .get('clientFormControl')
    //   .valueChanges.subscribe((value) => this.getAllClients(value));
    // Status

    this.assignedProfileForm
      .get('ManagerProfileId')
      .valueChanges.subscribe((value) => {
        if (value === this.assignedProfileForm.controls.ProfileId.value) {
          this.assignedProfileForm.controls.managerFormControl.setValue('');
          // this.assignedProfileForm.controls.ManagerProfileId.setValue('');
        }
      });
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

  setContractType(data: number) {
    const poNumber = this.assignedProfileForm.get('PONumber');
    const billingRate = this.assignedProfileForm.get('BillingRate');
    if (data === 0) {
      this.isBillable = true;
      poNumber.enable();
      billingRate.enable();
    } else {
      this.isBillable = false;
      poNumber.disable();
      billingRate.disable();
    }
    this.assignedProfileForm.controls.ContractType.setValue(data);
  }

  public deleteProfileImage() {
    this.showAvatar = !this.showAvatar;
    if (this.showAvatar) {
      this.profileImage = '../../../../../assets/images/upload-image-avatar.svg';
      this.formControls.removeImage.setValue(true);
    } else {
      this.profileImage = this.assignedProfileForm.controls.ProfileImage.value;
      this.formControls.removeImage.setValue(false);
    }
  }

  // Get Portfolios Data
  getAllPortfolios(value: string) {
    this.isUserStartTypeInPortfolioField = true;
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

  getEditedProfile(value: string) {
    this.http
      .fetch(
        `AssignedProfile/GetById${buildQueryString({
          id: value,
        })}`
      )
      .subscribe(({ result }) => {
        this.StatusID = result.status;
        this.editedProfile = result;
        this.assignedProfileForm.patchValue({
          FullName: result.fullName,
          externalEmployeeEmail: result.externalEmployeeEmail ? result.externalEmployeeEmail : '',
          Title: result.title,
          profileFormControl: result.profile,
          ProfileId: result.id,
          managerFormControl: {
            fullName: result.manager.name,
            id: result.manager.id,
          },
          ManagerProfileId: result.manager.id,
          clientFormControl: result.platform.portfolio.account,
          ClientId: result.platform.portfolio.account.id,
          portfolioFormControl: result.platform.portfolio,
          PortfolioId: result.platform.portfolio.id,
          teamFormControl: result.platform,
          teamId: result.platform.id,
          BillingRate: result.billingRate,
          serviceStartDate: result.serviceStartDate,
          PONumber: result.poNumber ? result.poNumber : '',
          clientManagerName: result.clientManagerName
            ? result.clientManagerName
            : '',
          clientManagerEmail: result.clientManagerEmail
            ? result.clientManagerEmail
            : '',
          department: result.department.id,
          ContractType: result.contractType,
          Location: result.location.id,
          Role: result.role.id,
          roleFormControl: result.role,
          notes: result?.notes ? result.notes : '',
          serviceEndDate: result.serviceEndDate,
          inheritEndDateFromPO: result?.inheritEndDateFromPO,
          inheritStartDateFromPO: result?.inheritStartDateFromPO

        });
        this._fireGetDepartments(result.platform.id)
        this.clientName = result.platform.portfolio.account.name;
        this.ManagerControl.setValue(result.manager.name);
        if(result.profileImageLink.includes('avatar-1577909.svg')){
          this.profileImage = '../../../../../assets/images/upload-image-avatar.svg';
          this.hideToggleIcon = true;
        }else {
          this.profileImage = result.profileImageLink;
          this.hideToggleIcon = false;
        };
        this.isUserStartTypeInManagerField = false;
        this.isUserStartTypeInClientField = false;
        this.isUserStartTypeInPortfolioField = false;
        this.isUserStartTypeInTeamField = false;
        this.departmentTypeConfig = {
          ...this.departmentTypeConfig,
          value: result.department.id,
        };
        this.selectedDepartment = result.department.name;
        this.contractTypeConfig = {
          ...this.contractTypeConfig,
          value: result.contractType,
        };
        this.locationTypesConfig = {
          ...this.locationTypesConfig,
          value: result.location.id,
        };
        this.rolesTypesConfig = {
          ...this.rolesTypesConfig,
          value: result.role.id,
        };
        if (result.contractType !== 0) {
          this.isBillable = false;
          this.assignedProfileForm.get('PONumber').disable();
          this.assignedProfileForm.get('BillingRate').disable();
        }
        this.selectedPO = result?.po;
        let previousMonthLastDay = moment().startOf('month').subtract(1, 'day').utc(false).format();
        if (moment(result?.serviceStartDate).isBefore(previousMonthLastDay)) {
          this.formControls.serviceStartDate.disable();
          this.formControls.inheritStartDateFromPO.disable();
        }
        if (result.inheritEndDateFromPO) {
          this.serviceEndDateMinDate = result.serviceEndDate
          this.formControls.serviceEndDate.disable();
        }
        if (this.formControls.serviceStartDate.enabled) {
          this.minDate = new Date(previousMonthLastDay);
        }
        this.changeBillableFields();
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

  // Set ID to the form control
  getTeam(value: any) {
    this.assignedProfileForm.controls.teamId.setValue(value.id);
  }

  getProfile(value: any) {
    this.assignedProfileForm.controls.ProfileId.setValue(value.id);
  }

  getRole(value: any) {
    this.assignedProfileForm.controls.Role.setValue(value.id);
  }

  getPortfolio(value: any) {
    this.assignedProfileForm.controls.PortfolioId.setValue(value.id);
  }

  getClient(value: any) {
    this.assignedProfileForm.controls.ClientId.setValue(value.id);
  }

  getManager(value: any) {
    this.assignedProfileForm.controls.ManagerProfileId.setValue(value.id);
  }

  getSelectedProfile(profile: any) {
    this.selectedProfile = profile;
  }

  get formControls() {
    return this.assignedProfileForm.controls;
  }

  public clearRoleValue(ev: any) {
    ev.stopPropagation();
    this.serviceDescriptionRef._handleFocus();
    this.serviceDescriptionRef._onTouched();
    this.assignedProfileForm.controls.Role.setValue('');
    this.assignedProfileForm.controls.roleFormControl.setValue('');
    // this.rolesTypes = [...this.allRolesTypes];
  }
  public clearManagerValue(ev: any) {
    ev.stopPropagation();
    this.assignedProfileForm.controls.ManagerProfileId.setValue('');
    this.assignedProfileForm.controls.managerFormControl.setValue('');
    this.filteredManagers = null;
    this.managerRef._handleFocus();
    this.managerRef._onTouched();
  }

  public clearAccountValue(ev: any) {
    ev.stopPropagation();
    this.accountRef._handleFocus();
    this.accountRef._onTouched();
    this.assignedProfileForm.controls.ClientId.setValue('');
    this.assignedProfileForm.controls.clientFormControl.setValue('');
    this.assignedProfileForm.controls.portfolioFormControl.setValue('');
    this.departmentTypeConfig = {
      ...this.departmentTypeConfig,
      value: '',
    };
    this.assignedProfileForm.controls.department.setValue('');
    this.clientName = 'Account';
    this.assignedProfileForm.controls.PortfolioId.setValue('');
    this.assignedProfileForm.controls.teamFormControl.setValue('');
    this.assignedProfileForm.controls.teamId.setValue('');
   
    this.filteredClients = null;
    this.filteredPortfolios = null;
    this.filteredTeams = null;

  }

  public clearPortfolioValue(ev: any) {
    ev.stopPropagation();
    this.assignedProfileForm.controls.PortfolioId.setValue('');
    this.assignedProfileForm.controls.portfolioFormControl.setValue('');
    this.assignedProfileForm.controls.teamFormControl.setValue('');
    this.assignedProfileForm.controls.teamId.setValue('');
    this.filteredTeams = null;
    this.portfolioRef._handleFocus();
    this.portfolioRef._onTouched();
    this.departmentTypeConfig = {
      ...this.departmentTypeConfig,
      value: '',
    };
    this.assignedProfileForm.controls.department.setValue('');

  }

  public clearPlatformValue(ev: any) {
    ev.stopPropagation();
    this.assignedProfileForm.controls.teamId.setValue('');
    this.assignedProfileForm.controls.teamFormControl.setValue('');
    this.platformRef._handleFocus();
    this.platformRef._onTouched();
    this.departmentTypeConfig = {
      ...this.departmentTypeConfig,
      value: '',
    };
    this.assignedProfileForm.controls.department.setValue('');
  }

  uploadProfileImage(event: Event) {
    this.errorMsg = '';
    const target = event.target as HTMLInputElement;

    if (this.imageTypes.indexOf(target.files[0].type) === -1) {
      this.errorMsg = 'Invalid Image Type';
    } else if (target.files[0].size <= 8000000) {
      this.assignedProfileForm.controls.removeImage.setValue(false);
      this.assignedProfileForm.controls.ProfileImage.setValue(target.files[0]);
    } else {
      this.errorMsg = 'Max size is 8 MB';
    }
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
  public changeBillableFields(): void {
    const formControlNames = ['department', 'clientFormControl', 'ClientId', 'portfolioFormControl', 'PortfolioId', 'teamFormControl', 'managerFormControl',  'clientManagerName', 'clientManagerEmail'];
    formControlNames.map(formControl => {
      if (this.isBillable) {
        this.assignedProfileForm.get([formControl]).disable();
      } else {
        this.assignedProfileForm.get([formControl]).enable();
      }

    })
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
    const formData = new FormData();
    formData.append('id', this.editedProfile.id);

    if (!this.isBillable) {
      this.assignedProfileForm.controls.PONumber.setValue('');
      this.assignedProfileForm.controls.BillingRate.setValue('');
      formData.append(
        'PONumber',
        this.assignedProfileForm.controls.PONumber.value
      );
      formData.append(
        'BillingRate',
        this.assignedProfileForm.controls.BillingRate.value
      );
    }
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

    this.http.post('AssignedProfile/Update', formData).subscribe((data) => {
      if (!data.errorMessage) {
        this._snacks.openSuccessSnackbar({
          message: `${this.assignedProfileForm.controls.FullName.value} has been updated`,
        });
        this._router.navigate(['assigned-profiles'], {});
      }
    });
  }

  setClientName(clientObject: any) {
    this.clientName = clientObject.name;
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
      this.minDate = new Date(moment().startOf('month').subtract(1,'day').utc(false).format())
    }
    if (formControl === 'serviceEndDate') {
      if (value && this.selectedPO) {
        this.formControls.serviceEndDate.setValue(new Date(this.selectedPO.endDate))
        this.formControls.serviceEndDate.disable();
      } else {
        this.formControls.serviceEndDate.setValue(moment().hours(0).minutes(0).milliseconds(0).utc(false).format())
        this.formControls.serviceEndDate.enable();
      }
      this.serviceEndDateMinDate = new Date(moment().startOf('month').subtract(1,'day').utc(false).format())
    }
  }
  private _scrollEvent = (): void => {
    if(this.serviceDescriptionRef?.panelOpen){
      this.serviceDescriptionRef.updatePosition();
    }else if(this.managerRef?.panelOpen){
      this.managerRef?.updatePosition();
    }else if(this.portfolioRef?.panelOpen){
      this.portfolioRef?.updatePosition();
    }else if(this.platformRef?.panelOpen){
      this.platformRef?.updatePosition();
    }else if(this.accountRef?.panelOpen){
      this.accountRef?.updatePosition();
    }
  }
}
