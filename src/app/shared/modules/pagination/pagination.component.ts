import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { SSAConfigInst } from 'src/app/config/app.config';
import { PaginationConfigModel } from './model/pagination.model';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent implements OnInit {
  constructor() {}

  @ViewChild(MatPaginator) paginator: MatPaginator;

  private _defaults: PaginationConfigModel = {
    pageIndex: SSAConfigInst.CRUD_CONFIG.paginationDefaults.startAt,
    pageSize: SSAConfigInst.CRUD_CONFIG.paginationDefaults.size,
    pageSizeOptions: SSAConfigInst.CRUD_CONFIG.paginationDefaults.options,
    activePageSize: SSAConfigInst.CRUD_CONFIG.paginationDefaults.size,
  };

  private _config: PaginationConfigModel = this._defaults;

  public get config(): PaginationConfigModel {
    return this._config;
  }

  @Input() public set config(config: PaginationConfigModel) {
    this._config = { ...this._defaults, ...config };
    // this._setPageSizeOptions();
  }

  @Output() paginationChange: EventEmitter<{
    pageSize: number;
    pageIndex: number;
  }> = new EventEmitter();

  ngOnInit() {}

  public paginate({ pageSize, pageIndex }) {
    // Recalculate pagination numbers when a user change the page size
    if (pageSize !== this.config.pageSize) {
      // Calculate the shown records and the targeted page number
      const shownRecords = this.config.pageSize * this.config.pageIndex || 1;
      const targetedPage = Math.ceil(shownRecords / pageSize) - 1;

      // Setting the value
      this._updateConfig(pageSize, targetedPage);
      this.paginationChange.emit({
        pageSize: this.config.pageSize,
        pageIndex: this.config.pageIndex,
      });

      // If two sizes are equal each other
    } else {
      this._updateConfig(pageSize, pageIndex);
      this.paginationChange.emit({
        pageSize: this.config.pageSize,
        pageIndex: this.config.pageIndex,
      });
    }
  }

  private _updateConfig(pageSize: number, pageIndex: number) {
    this.config.pageIndex = pageIndex;
    this.config.pageSize = pageSize;
  }

  private _setPageSizeOptions() {
    const recordsTotalCount = this.config.recordsTotalCount;
    if (recordsTotalCount > 10) {
      const defaultOptions =
        SSAConfigInst.CRUD_CONFIG.paginationDefaults.options;
      if (recordsTotalCount >= 100)
        // Records more than 100
        this.config.pageSizeOptions = defaultOptions;
      // => [100, 50, 30, 20]
      else if (recordsTotalCount >= 50 && recordsTotalCount < 100)
        // records Less than 100 and more than or equal 50
        this.config.pageSizeOptions = defaultOptions.filter(
          (option) => option <= 50
        );
      // => [50, 30, 10]
      else if (recordsTotalCount >= 30 && recordsTotalCount < 50)
        // Records Less than 50 and more than or equal 30
        this.config.pageSizeOptions = defaultOptions.filter(
          (option) => option <= 30
        );
      // => [30, 10]
      else if (recordsTotalCount < 30) this.config.pageSizeOptions = [10]; // Records more than 30
    }
  }
}
