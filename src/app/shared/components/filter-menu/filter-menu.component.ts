import { Component,Input, EventEmitter, Output, ViewChild} from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-filter-menu',
  templateUrl: './filter-menu.component.html',
  styles: [
    `
      :host {
        display: block;
      }
      .filterCount{
        background:var(--primary);
        width:20px;
        height:20px;
        border-radius:50%;
        color:white;
        display:inline-flex;
        justify-content:center;
        align-items:center;
      }
    `,
  ],
})
export class FilterMenuComponent {

  @ViewChild(MatMenuTrigger) menu:MatMenuTrigger;

  @Input() label: string = 'Menu';
  @Input() count: number = 0;
  @Input() isClearEnable: boolean = false;
  @Input() isShowClearBtn: boolean = true;
  @Input() menuClasses = ''
  @Output() public clearClick = new EventEmitter<any>();
  constructor() {}

  clear($event) {
    this.clearClick.emit($event);
  }

  stopPropagation(event) {
    event.stopPropagation();
  }
}
