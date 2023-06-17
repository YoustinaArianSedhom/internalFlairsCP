import { Component, OnInit } from '@angular/core';
import * as PO_MODELS from '@modules/po/models/po.models';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model'; 
import * as PO_Action from '../../state/po.actions'; 
import * as PO_CONFIG from '@modules/po/models/po.config';
import { POState } from '@modules/po/state/po.state';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { TableActionModel, TableConfigModel } from '@shared/modules/tables/model/tables.model';
import { TableCellAligns, TableCellTypes } from '@shared/modules/tables/model/tables.config';
import { TablesService } from '@shared/modules/tables/model/tables.service'; 
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { SSAConfigInst } from 'src/app/config/app.config';
import { MatDialog } from '@angular/material/dialog';
import { AddEditPoComponent } from '../add-edit-po/add-edit-po.component';
import { AssociateMultipleComponent } from '../associate-multiple/associate-multiple.component';
import { Router } from '@angular/router';

@Component({
  selector: 'customerPortal-table-po',
  templateUrl: './table-po.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class TablePoComponent implements OnInit {

  @Select(POState.pOList) public pOList$: Observable<PO_MODELS.POList[]>;
  @ViewSelectSnapshot(POState.pOListPagination) public pagination: PaginationConfigModel;
  @ViewSelectSnapshot(POState.showTotalAmount) public showTotalAmount: boolean;


  public tableConfig: TableConfigModel = {
    actions: [ {
      key: SSAConfigInst.CRUD_CONFIG.actions.update,
      label: 'Edit Purchase Order',
      icon: {
        name: 'edit',
      },
      hideCondition: (record: PO_MODELS.POList) => {
        return false;
      },
    },
    {
      key: SSAConfigInst.CRUD_CONFIG.actions.view,
      label: 'Associate multiple',
      icon: {
        isSVG: true,
        name: 'associate-multiple'
      },
      hideCondition: (record: PO_MODELS.POList) => (record.status == '1')
    },
    {
      key: 'add_association',
      label: 'Add Association',
      icon: {
        isSVG: true,
        name: 'add-association'
      },
      hideCondition: (record: PO_MODELS.POList) => (PO_CONFIG.status[record.status] === 'Closed')
    },
  ],
    keys: ['number','account', 'portfolio', 'platform','department', 'startDate','endDate','totalAmount','partnerName','status','manager','createdByName','creationDate','actions'],
    columns: [
      {
        key: 'number',
        head: 'PO Number',
        hidden: false,
        value: (record: PO_MODELS.POList) => record.number,
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
        key: 'account',
        head: 'Account',
        hidden: false,
        value: (record: PO_MODELS.POList) => record.account,
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
        key: 'portfolio',
        head: 'Portfolio',
        hidden: false,
        value: (record: PO_MODELS.POList) => record.portfolio,
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
        key: 'platform',
        head: 'Platform',
        hidden: false,
        value: (record: PO_MODELS.POList) => record.platform,
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
        key: 'department',
        head: 'Department',
        hidden: false,
        value: (record: PO_MODELS.POList) => record.department.name,
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
        key: 'startDate',
        head: 'Start Date',
        hidden: false,
        value: (record: PO_MODELS.POList) => record.startDate,
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        }, 
          type: TableCellTypes.date, 
      },
      {
        key: 'endDate',
        head: 'End Date',
        hidden: false,
        value: (record: PO_MODELS.POList) => record.endDate,
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        }, 
          type: TableCellTypes.date, 
      },
      {
        key: 'totalAmount',
        head: 'Total Amount',
        hidden: false,
        value: (record: PO_MODELS.POList) => { 
          return this.showTotalAmount ? record.totalAmount : `<span color="warn" class="mat-icon notranslate mat-warn material-icons ml-3">lock</span>`},

        extraInfoValue(record: PO_MODELS.POList){ return record.currency?.code },
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },  
        type: TableCellTypes.html,
      },
      {
        key: 'partnerName',
        head: 'PO Partner',
        hidden: false,
        value: (record: PO_MODELS.POList) => record.partnerName,
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        }, 
        //  type: TableCellTypes.currency, 
      },
      {
        key: 'status',
        head: 'PO Status',
        hidden: false,
        value: (record: PO_MODELS.POList) =>PO_CONFIG.status[record.status],
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.center,
          },
          bodyCell: {
            align: TableCellAligns.center,
            classes: (record: PO_MODELS.POList) => {
              let baseClass =
                'flex items-center justify-center text-s font-medium text-white px-1 rounded ';
              if (PO_CONFIG.status[record.status] === 'Created') {
                return (baseClass += ' bg-green-500');
              } else if (
                PO_CONFIG.status[record.status] === 'Closed'
              ) {
                return (baseClass += ' bg-red-500');
              } else {
                return (baseClass += ' bg-yellow-500');
              }
            },
          },
        }, 
        //  type: TableCellTypes.currency, 
      },
      {
        key: 'manager',
        head: 'Manager',
        hidden: false,
        value: (record: PO_MODELS.POList) => record.manager.fullName,
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
        key: 'createdByName',
        head: 'Created By',
        hidden: false,
        value: (record: PO_MODELS.POList) => record.createdByName,
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
        key: 'creationDate',
        head: 'Creation Date',
        hidden: false,
        value: (record: PO_MODELS.POList) => record.creationDate,
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        }, 
         type: TableCellTypes.date, 
      },
    ]
  }

 
  constructor(
    private _tableService: TablesService, 
    private _dialog: MatDialog,
    private _store: Store,
    private _router: Router
  ) { }

  public mapTableAction({record,action}: {record: PO_MODELS.POList, action: TableActionModel;}) {
    if (action.key == SSAConfigInst.CRUD_CONFIG.actions.update) {
      this.openEditPOModal(record);
    } else if (action.key == SSAConfigInst.CRUD_CONFIG.actions.view) {
      this._dialog.open(AssociateMultipleComponent, {
        data: record,
        panelClass: ['form-dialog--medium']
      })
    } else if (action.key === 'add_association') {
      this._router.navigateByUrl(`/assigned-profiles/create?po=${record.id}`);
    }
  }
  public openEditPOModal(model: PO_MODELS.POList) {
    
     this._dialog.open(AddEditPoComponent, {
      width: '100%',
      data: model,
    });
 
  }
  @Dispatch() public firePaginateChange(pagination: PaginationConfigModel) {
    return new PO_Action.PaginatePO(pagination)
  }

  ngOnInit(): void {
    this._tableService.setupConfig(this.tableConfig);
  }
}
