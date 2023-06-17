import { Component, OnInit, Input, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-range-select',
  templateUrl: './range-select.component.html',
  styleUrls: ['./range-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RangeSelectComponent implements OnInit {

  constructor() { }

  @Input() public start = 2;
  @Input() public end = 10;
  @Input() public step = 2;
  @Input() public multiple = false;
  @Input() public startFromZero = false;
  @Input() public label = 'Choose a number';
  @Input() public value: number;
  @Input() public disabled: boolean;



  public options: number[] = [];


  @Output() public valueChange: EventEmitter<number> = new EventEmitter<number>();


  ngOnInit() {
    this._fillOptionsBasedOnConfig();
  }

  public onSelectionChange($event) {
    this.valueChange.emit($event.value);
  }


  private _fillOptionsBasedOnConfig() {
    let index = this.step;
    while (index <= this.end) {
      this.options.push(index);
      index+= this.step;
    }
  }


}
