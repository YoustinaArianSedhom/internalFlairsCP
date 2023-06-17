import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-filter-row',
  templateUrl: './filter-row.component.html',
  styleUrls: ['./filter-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterRowComponent implements OnInit {

  constructor() { }

  @Input() public align = 'between';
  
  ngOnInit() {
  }

}
