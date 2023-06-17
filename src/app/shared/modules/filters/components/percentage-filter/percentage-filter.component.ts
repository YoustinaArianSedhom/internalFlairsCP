import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-percentage-filter',
  templateUrl: './percentage-filter.component.html',
  styleUrls: ['./percentage-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PercentageFilterComponent implements OnInit {

  constructor() { }

  @Input() public placeholder = 'percentage';
  @Input() public min = 1;
  @Input() public max = 100;
  @Input() public autocomplete = "off";
  @Input() public value = 1;
   

  @Output() public valueChange: EventEmitter<number> = new EventEmitter<number>();


  ngOnInit() {
  }

  public onPercentageValueChange($event) {
    this.valueChange.emit($event.target.value);
  }

  

}
