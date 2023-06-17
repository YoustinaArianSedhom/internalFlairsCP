import { Component, Input, OnInit } from '@angular/core';
import { TableColumnModel } from '../../model/tables.model';

@Component({
  selector: 'app-table-header',
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.scss']
})
export class TableHeaderComponent implements OnInit {

  constructor() { }

  @Input() column: TableColumnModel;

  ngOnInit(): void {
  }

}
