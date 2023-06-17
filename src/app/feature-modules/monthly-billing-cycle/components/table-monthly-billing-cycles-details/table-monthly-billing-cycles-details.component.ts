import { Component, OnInit } from '@angular/core';
import { MonthlyBillingCyclesState } from '@modules/monthly-billing-cycle/state/monthly-billing-cycle.state';
import { Observable } from 'rxjs';
import * as MONTHLY_BILLING_CYCLES_MODELS from '@modules/monthly-billing-cycle/models/monthly-billing-cycle.models';
import { Select ,Store} from '@ngxs/store';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import * as MONTHLY_BILLING_CYCLES_ACTIONS from '@modules/monthly-billing-cycle/state/monthly-billing-cycle.actions';
import {TableActionModel, TableConfigModel } from '@shared/modules/tables/model/tables.model';
import { TableCellAligns, TableCellTypes } from '@shared/modules/tables/model/tables.config';
import * as MONTHLY_BILLING_CYCLES_CONFIG from '@modules/monthly-billing-cycle/models/monthly-billing-cycle.config';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { ModalsService } from '@shared/modules/modals/model/modals.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalAddEditDiscountComponent } from '../modal-monthly-add-edit-discount/modal-monthly-add-edit-discount.component';
import { TablesService } from '@shared/modules/tables/model/tables.service';

@Component({
  selector: 'customerPortal-table-monthly-billing-cycles-details',
  templateUrl: './table-monthly-billing-cycles-details.component.html',
  styles: [
    `
      :host {
        display: block;
      }
      :host::ng-deep .mat-column-resource_name,
      :host::ng-deep .mat-column-resource_billing_start_date,
      :host::ng-deep .mat-column-resource_billing_end_date,
      :host::ng-deep .mat-column-service_name{
        min-width: 18rem !important;
      }
      :host::ng-deep .mat-column-manager,
      :host::ng-deep .mat-column-termination_date,
      :host::ng-deep .mat-column-service_description{
        min-width: 10rem !important;

      }
    `
  ]
})
export class TableMonthlyBillingCyclesDetailsComponent {
  @Select(MonthlyBillingCyclesState.monthlyBillingCyclesDetails) public monthlyBillingCyclesDetails$: Observable<MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleDetailsModel[]>;
  @ViewSelectSnapshot(MonthlyBillingCyclesState.monthlyBillingCyclesDetailsPagination) public pagination!: PaginationConfigModel;
  @ViewSelectSnapshot(MonthlyBillingCyclesState.showBillingRateAndAmount) public showBillingRateAndAmount: boolean;

  public tableConfig: TableConfigModel = {
  disableActionsCell: (record: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleDetailsModel) => { return record.billingCycleStatus === 1},

    actions: [
      {
        key: 'Delete_Discount',
        label: 'Delete Discount',
        icon: {
          name: 'delete-icon',
          isSVG: true
        },
        hideCondition: (record: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleDetailsModel) => ( (record.billingCycleStatus == 0 && !record.discountAmount) || record.billingCycleStatus == 1 )

      },
      {
        key: 'Add_Discount',
        label: 'Add Discount',
        icon: {
          name: 'add_discount',
          isSVG: true,
        },
        hideCondition: (record: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleDetailsModel) => ((record.billingCycleStatus == 0 && record.discountAmount !== null)|| record.billingCycleStatus == 1)

      },
      {
        key: 'Edit_Discount',
        label: 'Edit Discount',
        icon: {
          name: 'edit',
          isSVG: false,
        },
        hideCondition: (record: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleDetailsModel) => ( (record.billingCycleStatus == 0 && !record.discountAmount) || record.billingCycleStatus == 1 )

      },
    ],

    keys: ['resource_name', 'billing_rate', 'working_days', 'amount', 'po_number', 'platform', 'department', 'resource_billing_start_date', 'resource_billing_end_date', 'hiring_date', 'termination_date', 'service_name', 'service_description','Discount_Percentage','Discount_Amount', 'active_status', 'user_email', 'service_provided_on', 'manager','actions'],
    columns: [
      {
        key: 'resource_name',
        head: 'Resource name',
        value: (record: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleDetailsModel) => record?.resourceName,
        view: {
          width: 20,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
            classes: (record: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleDetailsModel)=>{
              let classes = ''
              //adding highlighted-color class to select parent element 'mat-row' to add custom style to the whole row  based on hasShortage
              if(record.hasShortage){
                classes += ' highlighted-color'
              }
              return classes
            }
          },
        },
      },
      {
        key: 'billing_rate',
        head: 'Billing rate',
        value: (record: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleDetailsModel) => { 
          return this.showBillingRateAndAmount ? record?.billingRate : `<span color="warn" class="mat-icon notranslate mat-warn material-icons ml-3">lock</span>`},

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
        head: 'Working days',
        value: (record: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleDetailsModel) => record?.workingDays,
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
        value: (record: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleDetailsModel) => { 
          return this.showBillingRateAndAmount ? record.currency.symbol + record?.amount.toFixed(2)  : `<span color="warn" class="mat-icon notranslate mat-warn material-icons ml-3">lock</span>`},
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
        key: 'po_number',
        head: 'PO Number',
        value: (record: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleDetailsModel) => record?.poNumber,
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
        value: (record: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleDetailsModel) => record?.platform?.name,
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
        value: (record: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleDetailsModel) => record?.department?.name,
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
        key: 'resource_billing_start_date',
        head: 'Resource billing start date',
        value: (record: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleDetailsModel) => record?.serviceStartDate,
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
        key: 'resource_billing_end_date',
        head: 'Resource billing end date',
        value: (record: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleDetailsModel) => record?.serviceEndDate,
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
        head: 'Hiring date',
        value: (record: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleDetailsModel) => record?.hiringDate,
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
        value: (record: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleDetailsModel) => record?.terminationDate,
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
        head: 'Service name',
        value: (record: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleDetailsModel) => record?.serviceName?.name,
        view: {
          width: 20,
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
        head: 'Service description',
        value: (record: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleDetailsModel) => record?.serviceDescription?.name,
        view: {
          width: 20,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
            classes:"pr-2"
          },
        },
      },
      {
        key: 'association_notes',
        head: 'Association notes',
        value: (record: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleDetailsModel) => record?.associationNotes,
        view: {
          width: 20,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
      },
      {
        key: 'po_notes',
        head: 'PO notes',
        value: (record: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleDetailsModel) => record?.poNotes,
        view: {
          width: 20,
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
        value: (record: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleDetailsModel) => {
          return record.discountPercentage ?record?.discountPercentage?.toFixed(2) + '%':null;
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
        value: (record: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleDetailsModel) => {
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
        key: 'active_status',
        head: 'Status',
        value: (record: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleDetailsModel) => MONTHLY_BILLING_CYCLES_CONFIG.ACTIVE_STATUS[record?.status],
        view: {
          width: 20,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
            classes: (record: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleDetailsModel) => {
              let baseClass =
                'flex items-center justify-center text-s font-medium text-white px-1 rounded ';
              if (MONTHLY_BILLING_CYCLES_CONFIG.ACTIVE_STATUS[record?.status] === 'Active') {
                return (baseClass += ' bg-green-500');
              } else if (
                MONTHLY_BILLING_CYCLES_CONFIG.ACTIVE_STATUS[record?.status] === 'Inactive'
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
        head: 'User email',
        value: (record: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleDetailsModel) => record?.userEmail,
        view: {
          width: 20,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
        type: TableCellTypes.email
      },
      {
        key: 'service_provided_on',
        head: 'Service provided on',
        value: (record: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleDetailsModel) => record?.serviceProvidedOnMonth + '/' + record?.serviceProvidedOnYear,
        view: {
          width: 20,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
      },
      {
        key: 'manager',
        head: 'Manager',
        value: (record: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleDetailsModel) => record?.manager?.fullName,
        view: {
          width: 20,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
      },

    ]
  }
  constructor(
    private _snackbar: SnackBarsService,
    private _modals: ModalsService,
    public dialog: MatDialog,
    private _store: Store,
    private _tableService: TablesService,
  ) { }

  @Dispatch() public paginateMonthlyBillingCyclesDetails(pagination: PaginationConfigModel) { return new MONTHLY_BILLING_CYCLES_ACTIONS.PaginateMonthlyBillingCyclesDetails(pagination) }
  ngOnInit(): void {
    this._tableService.setupConfig(this.tableConfig);
  }

  private _addEditDiscount(
    record: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleDetailsModel
  ) {
    this.openAddDiscountModal(record);
  }
  public openAddDiscountModal(record: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleDetailsModel) {
    this.dialog.open(ModalAddEditDiscountComponent, {
      width: '31.25rem',
      data: record,
    });
  }
  public mapTableAction ({ record, action, }: { record: MONTHLY_BILLING_CYCLES_MODELS.MonthlyBillingCycleDetailsModel; action: TableActionModel; }) {
     if (action.key === 'Delete_Discount') {
      this._modals.openConfirmationDialog(
        {
          title: 'Delete Discount',
          content: `please confirm to delete the Discount.? `,
          proceedText: 'Delete',
          cancelText: 'Cancel'
        },
        () => {
          this._store.dispatch(new MONTHLY_BILLING_CYCLES_ACTIONS.DeleteDiscountForResource(record.assignedProfileId)).subscribe(() => {
          this._store.dispatch(new MONTHLY_BILLING_CYCLES_ACTIONS.GetMonthlyBillingCyclesDetails());

            this._snackbar.openSuccessSnackbar({
              message: `Delete Discount has been done successfully`,
              duration: 5,
            });
          })
        }
      )}
        else if (action.key === 'Add_Discount' || action.key === 'Edit_Discount') {
          this._addEditDiscount(record);
        }
    }
  }

