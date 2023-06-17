import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss']
})
export class LinkComponent implements OnInit {

  constructor() { }

  private _INLINE = '_self';
  private _EXTERNAL = '_blank';

  @Input() public link = "/";
  @Input() public value = "Organization Details";
  @Input() public blank = false;
  @Input() public icon = false;
  @Input() public params: {[key: string]: any};
  @Input() public disabled = false;

  ngOnInit() {
  }


  public get target(): string {
    return this.blank ? this._EXTERNAL : this._INLINE;  
  }


  public get rel(): string {
    return this.blank ? 'noopener noreferrer' : '';
  }

}
