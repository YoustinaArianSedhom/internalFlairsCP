import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { TableActionModel, TableColumnModel, TableConfigModel } from '../../model/tables.model';
import { TablesService } from '../../model/tables.service';

@Component({
  selector: 'app-table-actions-cell',
  templateUrl: './table-actions-cell.component.html',
  styleUrls: ['./table-actions-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableActionsCellComponent implements OnInit {

  constructor(
    private _tablesService: TablesService,
    private _CDR: ChangeDetectorRef
  ) { }


  @Input() actions: TableActionModel[] = [];
  @Input() record: any;
  @Input() column: TableColumnModel;

  public config: TableConfigModel = this._tablesService.config;
  ngOnInit(): void {
    this._tablesService.tableConfigChange.subscribe((config: TableConfigModel) => { 
      this.config = {...config}
      this._CDR.markForCheck();
    })
  }


  public onActionClick(action: TableActionModel, record: any) {
    this._tablesService.tableActions.next({record, action})
  }

}
