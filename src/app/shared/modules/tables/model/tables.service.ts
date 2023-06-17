import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { TableActionModel, TableConfigModel } from './tables.model';

@Injectable({
  providedIn: 'root'
})
export class TablesService {

  constructor() { }

  public config: TableConfigModel;
  public columnsToDisplay: string[];

  @Output() public tableColumnsChange: EventEmitter<string[]> = new EventEmitter;
  @Output() public tableActionsChange: EventEmitter<TableActionModel[]> = new EventEmitter;
  @Output() public tableConfigChange: EventEmitter<TableConfigModel> = new EventEmitter;


  public tableActions: Subject<{record: any, action: TableActionModel}> = new Subject();

  public setupConfig(config: TableConfigModel) {
    this.config = config;
    this.columnsToDisplay = this.config.keys;
  }


  /**
   * Include column to columns that will be displayed or already displayed
   */
  public includeColumn(columnId: string, index?: number) {
    if (index != null && index == 0) this.config.keys.unshift(columnId);
    else if (index != null && index > 0) this.config.keys.splice(index, 0, columnId);
    else this.config.keys.push(columnId);

    // console.log(this.config.keys);
    this.tableColumnsChange.emit(this.config.keys);
  }


  /**
   * Exclude columns from columns that will be displayed or already displayed
   */
  public excludeColumn(columnId: string) {
    this.config.keys = this.config.keys.filter(key => key !== columnId)
    this.tableColumnsChange.emit(this.config.keys)
  }



  /**
   * Activate action on the actions list
   */
  public enableAction(key: string) {
    this.config.actions.forEach(action => {
      if (action.key == key) action.active = true;
    });
    this.tableActionsChange.emit(this.config.actions)
  }

  public disableActions() {
    this.config.disableActionsCell = (record) => true;
    this.tableConfigChange.emit(this.config)
  }

  /**
   * Disable Actions on the actions list
   */
  public disableAction(key: string) {
    this.config.actions.forEach(action => {
      if (action.key == key) action.active = false;
    });
    this.tableActionsChange.emit(this.config.actions)
  }

}
