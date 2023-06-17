import { deleteAssignedProfiles } from './../../../state/assigned_profile.actions';
import { ModalsService } from './../../../../../shared/modules/modals/model/modals.service';
import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild, ViewChildren } from '@angular/core';
import {
  TableCellAligns,
  TableCellTypes,
} from '@shared/modules/tables/model/tables.config';
import {
  TableActionModel,
  TableConfigModel,
} from '@shared/modules/tables/model/tables.model';
import { SSAConfigInst } from 'src/app/config/app.config';
import * as ASSIGNED_PROFILE_MODELS from '../../../models/assigned-profile.model';
import * as ASSIGNED_PROFILE_CONFIGS from '../../../models/assigned-profile.config';
import * as ASSIGNED_PROFILE_ACTIONS from '../../../state/assigned_profile.actions';
import { TablesService } from '@shared/modules/tables/model/tables.service';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { MatDialog } from '@angular/material/dialog';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserModel } from '@modules/user-management/model/user-management.models';
import { AssignedProfileState } from '@modules/assigned-profiles/state/assigned_profile.state';
import { DatePipe } from '@angular/common';
import { ModalAssignedProfilesComponent } from '../../modal-assigned-profiles/modal-assigned-profiles.component';
import { AssignedProfilesService } from '@modules/assigned-profiles/models/assigned-profiles.service';
import { ModalEndAssociationComponent } from '../../modal-end-association/modal-end-association.component';
import {ModalEditEndAssociationComponent} from '../../modal-edit-end-association/modal-edit-end-association.component';
import moment from 'moment';
// import { ModalProfilesComponent } from '../../modal-assigned-profiles/modal-assigned-profiles.component';
import { ToggleContractTypeFormComponent } from '../../toggle-contract-type-form/toggle-contract-type-form.component';

@Component({
  selector: 'app-table-assigned-profiles',
  templateUrl: './table-assigned-profiles.component.html',
  styleUrls: ['./table-assigned-profiles.components.scss'],
 
})
export class TableAssignedProfilesComponent implements OnInit, OnDestroy {

  // @Input() clientID;
  @ViewChild('tableRef', {read: ElementRef}) tableRef: ElementRef
  @Output() OpenModal = new EventEmitter<string>();

  @Select(AssignedProfileState.profiles) public profiles$: Observable<
    ASSIGNED_PROFILE_MODELS.ProfilesModel[]
  >;

  // @ViewSelectSnapshot(AssignedProfileState.profiles)
  // public Profiles: ASSIGNED_PROFILE_MODELS.ProfilesModel[];

  @ViewSelectSnapshot(AssignedProfileState.paginationConfig)
  public pagination: PaginationConfigModel;

  @Select(AssignedProfileState.specificProfile)
  public specificProfile$: Observable<ASSIGNED_PROFILE_MODELS.ProfilesModel>;

 


  public contractTypes = ASSIGNED_PROFILE_CONFIGS.ContractTypesNames;
  public user: UserModel;
  public isPanelOpen = false;
  public sidePanelData = null;
  public status = ASSIGNED_PROFILE_CONFIGS.status;

  public tableConfig: TableConfigModel = {
    actions: [
      {
        key: SSAConfigInst.CRUD_CONFIG.actions.update,
        label: 'Edit',
        icon: {
          name: 'edit',
          isSVG: false,
        },
        hideCondition: (record: ASSIGNED_PROFILE_MODELS.ProfilesModel) => (ASSIGNED_PROFILE_CONFIGS.status[record.status] === 'Inactive') || (ASSIGNED_PROFILE_CONFIGS.status[record.status] === 'Decommissioned')
      },
      {
        key: SSAConfigInst.CRUD_CONFIG.actions.delete,
        label: 'Delete',
        icon: {
          name: 'delete',
          isSVG: false,
        },
        hideCondition: (record: ASSIGNED_PROFILE_MODELS.ProfilesModel) => record.isIncludedInClosedBillingCycle,
      },
      {
        key: SSAConfigInst.CRUD_CONFIG.actions.view,
        label: 'View Details',
        icon: {
          name: 'visibility',
        },
        hideCondition: (record: ASSIGNED_PROFILE_MODELS.ProfilesModel) => false
      },
      {
        key: 'terminate',
        label: 'End Association',
        icon: {
          name: 'end-association',
          isSVG: true,
        },
        hideCondition: (record: ASSIGNED_PROFILE_MODELS.ProfilesModel) =>  !(ASSIGNED_PROFILE_CONFIGS.status[record.status] === 'Active' || ASSIGNED_PROFILE_CONFIGS.status[record.status] === 'Decommissioned')
      },
      {
        key: 'edit-end-association',
        label: 'Edit End Association',
        icon: {
          name: 'edit-end-association',
          isSVG: true,
        },
        hideCondition: (record: ASSIGNED_PROFILE_MODELS.ProfilesModel) => (ASSIGNED_PROFILE_CONFIGS.status[record.status] !== 'Inactive' || !record.serviceEndDate || !record.isEndAssociationDataEditable)
      },
      {
        key: 'toggle_contract_type',
        label: 'Change to Billable',
        icon: {
          name: 'toggle_contract_type',
          isSVG: true,
        },
        hideCondition: (record: ASSIGNED_PROFILE_MODELS.ProfilesModel) => ASSIGNED_PROFILE_CONFIGS.status[record.status] === 'Active' && record.contractType ? false : true
      },
      {
        key: 'toggle_contract_type',
        label: 'Change to non Billable',
        icon: {
          name: 'toggle_contract_type',
          isSVG: true,
        },
        hideCondition: (record: ASSIGNED_PROFILE_MODELS.ProfilesModel) =>  ASSIGNED_PROFILE_CONFIGS.status[record.status] === 'Active' && !record.contractType? false : true
      },
      {
        key: 'clone_association',
        label: 'Clone association',
        icon: {
          name: 'clone_association',
          isSVG: true,
        },
      },
    ],
    keys: [
      'fullName',
      'account',
      'portfolio',
      'platform',
      'department',
      'Organization Mail',
      'serviceStartDate',
      'serviceEndDate',
      'poNumber',
      // 'joining date',
      'status',
      'actions',
    ],
    columns: [
      {
        key: 'fullName',
        head: 'full Name',
        hidden: false,
        value: (record: ASSIGNED_PROFILE_MODELS.ProfilesModel) => (
          {
            key: 'name',
            label: record.fullName,
          }),
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            // classes: 'flex align-center py-2',
            align: TableCellAligns.start,
            classes: 'underline cursor-pointer text-primary',
          },
        },
        type: TableCellTypes.eventEmitter,
      },

      {
        key: 'account',
        head: 'Account',
        hidden: false,
        value: (record: ASSIGNED_PROFILE_MODELS.ProfilesModel) => record.platform.portfolio.account.name,
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            // classes: 'flex align-center text-center',
            align: TableCellAligns.start,
          },
        },
      },
      {
        key: 'portfolio',
        head: 'Portfolio',
        hidden: false,
        value: (record: ASSIGNED_PROFILE_MODELS.ProfilesModel) => record.platform.portfolio.name,
        view: {
          width: 20,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            // classes: 'flex align-center text-center',
            align: TableCellAligns.start,
          },
        },
      },
      {
        key: 'platform',
        head: 'Platform',
        hidden: false,
        value: (record: ASSIGNED_PROFILE_MODELS.ProfilesModel) => record.platform.name,
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            // classes: 'flex align-center text-center',
            align: TableCellAligns.start,
          },
        },
      },
      {
        key: 'department',
        head: 'Department',
        hidden: false,
        value: (record: ASSIGNED_PROFILE_MODELS.ProfilesModel) => record.department?.name,
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            // classes: 'flex align-center text-center',
            align: TableCellAligns.start,
          },
        },
      },
      {
        key: 'Organization Mail',
        head: 'Organization Mail',
        hidden: false,
        value: (record: ASSIGNED_PROFILE_MODELS.ProfilesModel) => record.profile.organizationEmail,
        view: {
          width: 25,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            // classes: 'flex align-center py-2',
            align: TableCellAligns.start,
          },
        },
        type: TableCellTypes.email,
      },
      {
        key: 'serviceStartDate',
        head: 'Billing Start Date',
        hidden: false,
        value: (record: ASSIGNED_PROFILE_MODELS.ProfilesModel) => moment.parseZone(record.serviceStartDate).format('ll'),
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            // classes: 'flex align-center py-2',
            align: TableCellAligns.start,
          },
        },
        // type: TableCellTypes.date,
      },
      {
        key: 'serviceEndDate',
        head: 'Billing End Date',
        hidden: false,
        value: (record: ASSIGNED_PROFILE_MODELS.ProfilesModel) =>  moment.parseZone(record.serviceEndDate).format('ll'),
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
        // type: TableCellTypes.date,
      },
      {
        key: 'poNumber',
        head: 'PO Number',
        hidden: false,
        value: (record: ASSIGNED_PROFILE_MODELS.ProfilesModel) => record.poNumber,
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
      },
      {
        key: 'status',
        head: 'Status',
        hidden: false,
        value: (record: ASSIGNED_PROFILE_MODELS.ProfilesModel) => ASSIGNED_PROFILE_CONFIGS.status[record.status],
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.center,
          },
          bodyCell: {
            align: TableCellAligns.center,
            classes: (record: ASSIGNED_PROFILE_MODELS.ProfilesModel) => {
              let baseClass =
                'flex items-center justify-center text-s font-medium text-white px-1 rounded ';
              if (ASSIGNED_PROFILE_CONFIGS.status[record.status] === 'Active') {
                return (baseClass += ' bg-green-500');
              } else if (
                ASSIGNED_PROFILE_CONFIGS.status[record.status] === 'Inactive'
              ) {
                return (baseClass += ' bg-red-500');
              } else {
                return (baseClass += ' bg-yellow-500');
              }
            },
          },
        },
      },
    ],
  };

  constructor(
    private _tableService: TablesService,
    private _store: Store,
    private _snackbars: SnackBarsService,
    private _router: Router,
    private _route: ActivatedRoute,
    public dialog: MatDialog,
    public datepipe: DatePipe,
    private _modals: ModalsService,
    private _AssignedProfileService: AssignedProfilesService
  ) {}

  ngOnDestroy(): void {
    if(this.tableRef) localStorage.setItem('scrollYPos', this.tableRef.nativeElement.children[0].scrollTop)
  }

  @Dispatch() public getProfile(id: string) {
    return new ASSIGNED_PROFILE_ACTIONS.getAssignedProfileById(id);
  }

  @Dispatch() public firePaginateMyTeams(pagination: PaginationConfigModel) {
    // console.log('fired pagination', pagination);
    const pagintationForm: PaginationConfigModel = {
      pageSize: pagination.pageSize,
      pageIndex: pagination.pageIndex,
    };
    return new ASSIGNED_PROFILE_ACTIONS.paginateMyTeams(pagintationForm);
  }

  @Dispatch() private _fireProfilesTable() {
    return new ASSIGNED_PROFILE_ACTIONS.filterAssignedProfiles();
  }

  @Dispatch() private _fireGetDepartments() {
    return new ASSIGNED_PROFILE_ACTIONS.getDepartments();
  }

  panelClose() {
    this.isPanelOpen = false;
  }

  ngOnInit(): void {
    this._tableService.setupConfig(this.tableConfig);
    // this._fireProfilesTable();
    this.specificProfile$.subscribe((data) => (this.sidePanelData = data));
    // this._fireGetDepartments()
    this.profiles$.subscribe(()=>{
      if(localStorage.getItem('scrollYPos') || localStorage.getItem('scrollYPos')==='0'){
        var lastYPos = +localStorage.getItem('scrollYPos')
        setTimeout(()=> {if(this.tableRef?.nativeElement?.children[0]) this.tableRef.nativeElement.children[0].scrollTop = lastYPos})  
      }
    })
  }

   public openModal(id: string) {
    let modalData;
    // this.profiles$.subscribe(
    //   (data) => (modalData = data.filter((record) => record.id === id))
    // );
    const dialogRef = this.dialog.open(ModalAssignedProfilesComponent, {
      width: '31.25rem',
      data: id,
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('The dialog was closed');
    });
  }

  public openEndAssociationModal(record: ASSIGNED_PROFILE_MODELS.ProfilesModel) {
    this.dialog.open(ModalEndAssociationComponent, {
      width: '31.25rem',
      data: record,
    });
  }
  public openEditEndAssociationModal(record: ASSIGNED_PROFILE_MODELS.ProfilesModel) {
    this.dialog.open(ModalEditEndAssociationComponent, {
      width: '31.25rem',
      data: record,
    });
  }
  /*_________________________________________ACTIONS TRIGGERS_______________________________________*/

  changePannelData(id: string) {
    this.getProfile(id);
  }

  editProfile(id: string) {
    this._router.navigate(['edit', id], {
      relativeTo: this._route,
    });
  }
 
  


  mapTableAction({
    record,
    action,
  }: {
    record: ASSIGNED_PROFILE_MODELS.ProfilesModel;
    action: TableActionModel;
  }) {
    if (action.key === SSAConfigInst.CRUD_CONFIG.actions.view) {
      this.sidePanelData = record;
      this.isPanelOpen = true;
    }
    if (action.key === 'name') {
      this.sidePanelData = record;
      this.isPanelOpen = true;
    } else if (action.key === SSAConfigInst.CRUD_CONFIG.actions.delete) {
      this._deleteAssignedProfile(record);
    } else if (action.key === SSAConfigInst.CRUD_CONFIG.actions.update) {
      this.editProfile(record.id);
    }
    else if (action.key === 'terminate') {
      this._endAssociation(record);
    }
    else if (action.key === 'edit-end-association') {
      this._editendAssociation(record);
    }
    else if (action.key === 'toggle_contract_type') {
      this.dialog.open(ToggleContractTypeFormComponent, {
        data: record,
        panelClass: ['form-dialog--medium']
      })
    }
    else if (action.key === 'clone_association') {
      this._router.navigateByUrl(`/assigned-profiles/create?association=${record.id}`);

    }
  }

  private _deleteAssignedProfile(
    record: ASSIGNED_PROFILE_MODELS.ProfilesModel
  ) {
    this._modals.openConfirmationDialog(
      {
        title: SSAConfigInst.CRUD_CONFIG.actions.delete,
        content: SSAConfigInst.CRUD_CONFIG.confirmationMessages.delete(
          'Assigned Profile -' + record.fullName
        ),
        proceedText: SSAConfigInst.CRUD_CONFIG.actions.delete,
        cancelText: 'Cancel',
      },
      () => {
        // console.log('record', record);
        this._store
          .dispatch(new deleteAssignedProfiles(record.id))
          .subscribe(() => {
            this._snackbars.openSuccessSnackbar({
              message: SSAConfigInst.CRUD_CONFIG.successMessages.deleted(
                record.fullName
              ),
            });
            this._fireProfilesTable();
          });
      }
    );
  }

  private _endAssociation(
    record: ASSIGNED_PROFILE_MODELS.ProfilesModel
  ) {
    this.openEndAssociationModal(record);
  }
  private _editendAssociation(
    record: ASSIGNED_PROFILE_MODELS.ProfilesModel
  ) {
    this.openEditEndAssociationModal(record);
  }

}
