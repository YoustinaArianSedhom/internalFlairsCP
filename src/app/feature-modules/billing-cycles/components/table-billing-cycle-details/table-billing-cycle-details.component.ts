import { BillingCyclesState } from '@modules/billing-cycles/state/billing-cycles.state';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { TableActionModel, TableConfigModel } from '@shared/modules/tables/model/tables.model';
import { TableCellAligns, TableCellTypes } from '@shared/modules/tables/model/tables.config';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import * as BILLING_CYCLES_ACTIONS from '@modules/billing-cycles/state/billing-cycles.actions';
import * as BILLING_CYCLES_MODELS from "@modules/billing-cycles/models/billing-cycles.models";
import * as BILLING_CYCLES_CONFIG from '@modules/billing-cycles/models/billing-cycles.config'
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { ModalsService } from '@shared/modules/modals/model/modals.service';
import { ModalAddEditDiscountComponent } from '../modal-add-edit-discount/modal-add-edit-discount.component';
import { MatDialog } from '@angular/material/dialog';
import { TablesService } from '@shared/modules/tables/model/tables.service';

@Component({
  selector: 'customerPortal-table-billing-cycle-details',
  templateUrl: './table-billing-cycle-details.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class TableBillingCycleDetailsComponent {
  @Select(BillingCyclesState.poDetails) public poDetails$: Observable<BILLING_CYCLES_MODELS.BillingCycleDetailsModel[]>
  @ViewSelectSnapshot(BillingCyclesState.poPagination) public pagination!: PaginationConfigModel;
  @ViewSelectSnapshot(BillingCyclesState.showBillingRateAndAmount) public showBillingRateAndAmount: boolean;
  @ViewSelectSnapshot(BillingCyclesState.selectedCycle) public selectedCycle: BILLING_CYCLES_MODELS.BillingCycleModel
  public tableConfig: TableConfigModel = {
    disableActionsCell: (record: BILLING_CYCLES_MODELS.BillingCycleDetailsModel) => { return record.billingCycleStatus === 1},
    actions: [
      {
        key: 'Delete_Discount',
        label: 'Delete Discount',
        icon: {
          name: 'delete-icon',
          isSVG: true
        },
        hideCondition: (record: BILLING_CYCLES_MODELS.BillingCycleDetailsModel) => ((record.billingCycleStatus === 0 && !record.discountAmount) || record.billingCycleStatus === 1)
      },
      {
        key: 'Add_Discount',
        label: 'Add Discount',
        icon: {
          name: 'add_discount',
          isSVG: true,
        },
        hideCondition: (record: BILLING_CYCLES_MODELS.BillingCycleDetailsModel) => ((record.billingCycleStatus === 0 && record.discountAmount !== null) || record.billingCycleStatus === 1)
      },
      {
        key: 'Edit_Discount',
        label: 'Edit Discount',
        icon: {
          name: 'edit',
          isSVG: false,
        },
        hideCondition: (record: BILLING_CYCLES_MODELS.BillingCycleDetailsModel) => ((record.billingCycleStatus === 0 && !record.discountAmount) || record.billingCycleStatus === 1)
      },
    ],
    keys: ['resource_name', 'billing_rate', 'working_days', 'amount', 'po_number', 'platform', 'department', 'service_start_date', 'service_end_date', 'hiring_date', 'termination_date', 'service_name', 'service_description', 'notes','Discount_Percentage','Discount_Amount','status', 'user_email', 'actions'],
    columns: [
      {
        key: 'resource_name',
        head: 'Resource name',
        value: (record: BILLING_CYCLES_MODELS.BillingCycleDetailsModel) => {
          return record.resourceName;
        },
        view: {
          width: 20,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
            classes: (record: BILLING_CYCLES_MODELS.BillingCycleDetailsModel) => {
              let classes = ''
              //adding highlighted-color class to select parent element 'mat-row' to add custom style to the whole row  based on hasShortage
              if (this.selectedCycle?.hasShortage) {
                classes += ' highlighted-color'
              }
              return classes
            }
          },
        },
      },
      {
        key: 'billing_rate',
        head: 'Billing Rate',
        // value: (record: BILLING_CYCLES_MODELS.BillingCycleDetailsModel) => {
        //   return record?.billingRate ? record?.billingRate : '0';
        // },
        value: (record: BILLING_CYCLES_MODELS.BillingCycleDetailsModel) => {
          return !this.showBillingRateAndAmount ? `<span color="warn" class="mat-icon notranslate mat-warn material-icons ml-3">lock</span>` : record?.billingRate ? record?.billingRate : '0'
        },

        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
        type: TableCellTypes.html
      },
      {
        key: 'working_days',
        head: 'Working Days',
        value: (record: BILLING_CYCLES_MODELS.BillingCycleDetailsModel) => {
          return record?.workingDays ? record?.workingDays : '0';
        },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
      },
      {
        key: 'amount',
        head: 'Amount',
        // value: (record: BILLING_CYCLES_MODELS.BillingCycleDetailsModel) => record?.amount,
        value: (record: BILLING_CYCLES_MODELS.BillingCycleModel) => { 
          return this.showBillingRateAndAmount ? record?.currency?.symbol + record?.amount.toFixed(2)  : `<span color="warn" class="mat-icon notranslate mat-warn material-icons ml-3">lock</span>` 
        },

        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
        type: TableCellTypes.html
      },
      {
        key: 'po_number',
        head: 'PO Number',
        value: (record: BILLING_CYCLES_MODELS.BillingCycleDetailsModel) => {
          return record?.poNumber;
        },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
      },
      {
        key: 'platform',
        head: 'Platform',
        value: (record: BILLING_CYCLES_MODELS.BillingCycleDetailsModel) => { return record?.platform?.name },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
      },
      {
        key: 'department',
        head: 'Department',
        value: (record: BILLING_CYCLES_MODELS.BillingCycleDetailsModel) => { return record?.department?.name },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
      },
      {
        key: 'service_start_date',
        head: 'Billing Start Date',
        value: (record: BILLING_CYCLES_MODELS.BillingCycleDetailsModel) => { return record?.serviceStartDate },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
        type: TableCellTypes.date
      },
      {
        key: 'service_end_date',
        head: 'Billing End Date',
        value: (record: BILLING_CYCLES_MODELS.BillingCycleDetailsModel) => { return record?.serviceEndDate },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
        type: TableCellTypes.date
      },
      {
        key: 'hiring_date',
        head: 'Hiring Date',
        value: (record: BILLING_CYCLES_MODELS.BillingCycleDetailsModel) => { return record?.hiringDate },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
        type: TableCellTypes.date
      },
      {
        key: 'termination_date',
        head: 'Last working date',
        value: (record: BILLING_CYCLES_MODELS.BillingCycleDetailsModel) => { return record?.terminationDate },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
        type: TableCellTypes.date
      },
      {
        key: 'service_name',
        head: 'Service Name',
        value: (record: BILLING_CYCLES_MODELS.BillingCycleDetailsModel) => {
          return record?.serviceName;
        },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
      },
      {
        key: 'service_description',
        head: 'Service Description',
        value: (record: BILLING_CYCLES_MODELS.BillingCycleDetailsModel) => {
          return record?.role?.name;
        },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
      },
      {
        key: 'notes',
        head: 'Notes',
        value: (record: BILLING_CYCLES_MODELS.BillingCycleDetailsModel) => {
          return record?.notes;
        },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
      },
      {
        key: 'Discount_Percentage',
        head: 'Discount Percentage',
        value: (record: BILLING_CYCLES_MODELS.BillingCycleDetailsModel) => {
          return record.discountPercentage ? record?.discountPercentage?.toFixed(2) + '%':null;
        },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
      },
      {
        key: 'Discount_Amount',
        head: 'Discount Amount',
        value: (record: BILLING_CYCLES_MODELS.BillingCycleDetailsModel) => {
          return record.discountAmount ? record?.currency?.symbol +record?.discountAmount?.toFixed(2):null;
        },
        view: {
          width: 10,
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
        value: (record: BILLING_CYCLES_MODELS.BillingCycleDetailsModel) => {
          return BILLING_CYCLES_CONFIG.EmployeeStatus[record?.status];
        },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
            classes: (record: BILLING_CYCLES_MODELS.BillingCycleDetailsModel) => {
              let baseClass =
                'flex items-center justify-center text-s font-medium text-white px-1 rounded ';
              if (BILLING_CYCLES_CONFIG.EmployeeStatus[record.status] === 'Active') {
                return (baseClass += ' bg-green-500');
              } else if (
                BILLING_CYCLES_CONFIG.EmployeeStatus[record.status] === 'Inactive'
              ) {
                return (baseClass += ' bg-red-500');
              } else {
                return (baseClass += ' bg-yellow-500');
              }
            },
          },
        },
      },
      {
        key: 'user_email',
        head: 'User Email',
        value: (record: BILLING_CYCLES_MODELS.BillingCycleDetailsModel) => {
          return record?.userEmail;
        },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
        type: TableCellTypes.email
      },
    ]
  }
  constructor(
    public dialog: MatDialog,
    private _snackbar: SnackBarsService,
    private _modals: ModalsService,
    private _store: Store,
    private _tableService: TablesService,
  ) { }
  @Dispatch() paginateBillingCycleDetails(pagination: PaginationConfigModel) { return new BILLING_CYCLES_ACTIONS.PaginateBillingCycleDetails(pagination) }
  ngOnInit(): void {
    this._tableService.setupConfig(this.tableConfig);
  }
  public openAddDiscountModal(record: BILLING_CYCLES_MODELS.BillingCycleDetailsModel) {
    this.dialog.open(ModalAddEditDiscountComponent, {
      width: '31.25rem',
      data: record,
    });
  }
  public mapTableAction({ record, action, }: { record: BILLING_CYCLES_MODELS.BillingCycleDetailsModel; action: TableActionModel; }) {
    if (action.key === 'Delete_Discount') {
      this._modals.openConfirmationDialog(
        {
          title: 'Delete Discount',
          content: `Please confirm to delete the Discount? `,
          proceedText: 'Delete',
          cancelText: 'Cancel'
        },
        () => {
          this._store.dispatch(new BILLING_CYCLES_ACTIONS.DeleteDiscountForResource(record.assignedProfileId)).subscribe(() => {
             this._store.dispatch(new BILLING_CYCLES_ACTIONS.GetBillingCycleDetails());
           
            this._snackbar.openSuccessSnackbar({
              message: `Delete discount has been done successfully`,
              duration: 5,
            });
          })
        }
      )
    } else if (action.key === 'Add_Discount' || action.key === 'Edit_Discount') {
      this.openAddDiscountModal(record);
    }
  }
}
