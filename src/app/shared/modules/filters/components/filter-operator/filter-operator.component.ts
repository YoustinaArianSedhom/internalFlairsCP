import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-filter-operator',
  templateUrl: './filter-operator.component.html',
  styleUrls: ['./filter-operator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
 
export class FilterOperatorComponent implements OnInit {

  constructor() { }

  @Input() public operator: string;
  @Input() public disabled: boolean;
  @Output() public operatorChange: EventEmitter<number> = new EventEmitter();
  

  public operators: {key: number; value: string}[] = [
    {
      key: 0,
      value: '=> greater than or Equal'
    }, {
      key: 1,
      value: '= equals'
    }, {
      key: 2,
      value: '<= less than or Equal'
    }
  ];


  ngOnInit() {
  }


  public onFilterOperatorChange($event) {
    this.operatorChange.emit(parseInt($event.value, 10));
  }

}
