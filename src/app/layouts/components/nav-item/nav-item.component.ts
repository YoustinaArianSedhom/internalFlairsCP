import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
import { Router } from '@angular/router';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { HideSpinner, ShowSpinner } from '@core/modules/spinner/state/spinner.actions';
import { Store } from '@ngxs/store';
@Component({
  selector: 'app-nav-item',
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.scss'],
  animations: [
    trigger('openClose', [
      // ...
      state('open', style({
        opacity: 1
      })),
      state('closed', style({
        opacity: 0
      })),
      transition('open => closed', [
        animate('0.5s')
      ]),
      transition('closed => open', [
        animate('0.5s')
      ]),
    ]),
  ],
})
export class NavItemComponent implements OnInit {
  @Input() link?: string;
  @Input() action?: string;
  @Input() icon!: string;
  @Input() label!: string;
  @Input() current: any;
  @Input() children: any;
  @Input() iconsOnly: any;
  @Input() queries!: object;
  @Input() materialIcon!: {isSvg: boolean; name: string};
  @Output() clickHandler= new EventEmitter();
  public collapsed = true;


  constructor(private _router: Router, private _store: Store) {
  }

  ngOnInit() {}

  public ShowChildren(){
    this.collapsed = !this.collapsed;
    
  }

  public hideSpinnerOnKeyboardEvents($event: KeyboardEvent) {
    if ($event && ($event.ctrlKey || $event.shiftKey)) {
      setTimeout(() => {
        this._store.dispatch(new HideSpinner())
      }, 300)
    }
  }
  @Dispatch() public showLoader() {return new ShowSpinner();}

}
