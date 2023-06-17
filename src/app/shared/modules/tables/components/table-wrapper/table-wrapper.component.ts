import {  Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { SSAConfigInst } from 'src/app/config/app.config';
import { Observable } from 'rxjs';
import {
  TableActionModel,
  TableConfigModel,
} from '../../model/tables.model';
import { TablesService } from '../../model/tables.service';

@Component({
  selector: 'app-table-wrapper',
  templateUrl: './table-wrapper.component.html',
  styleUrls: ['./table-wrapper.component.scss'],
})
export class TableWrapperComponent implements OnInit {
  constructor(private _tablesService: TablesService) {}

  @Input() public classes: any;
  @Input() public records$: Observable<any> | any;
  @Input() public config: TableConfigModel;
  @Output() public actionTaken: EventEmitter<{
    action: TableActionModel;
    record: any;
  }> = new EventEmitter();

  @Output() public sortChange: EventEmitter<{
    sortField: number;
    sortType: number;
  }> = new EventEmitter();

 

  ngOnInit(): void {
    this._tablesService.tableActionsChange.subscribe(
      (actions: TableActionModel[]) => {
        this.config = { ...this.config, actions };
      }
    );

    this._tablesService.tableColumnsChange.subscribe((columns: string[]) => {
      this.config = { ...this.config, keys: columns };
    });

    this._tablesService.tableActions.subscribe(
      (action: { record: any; action: TableActionModel }) => {
        this.actionTaken.emit(action);
      }
    );
  }
  
  public getColumn(key: string) {
    return this.config.columns.find((column) => column.key == key);
  }

  public get columnsWithoutActions() {
    return this.config.keys.filter((column) => {
      return column != 'actions';
    });
  }

  public onSortChange($event: Sort) {
    const sortField = this.config.columns.find(
      (column) => column.key == $event.active
    ).sort.sortField;
    this.sortChange.emit({
      sortField,
      sortType: SSAConfigInst.CRUD_CONFIG.sort[$event.direction],
    });
  }
}
