import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ssa-info-field',
  templateUrl: './info-field.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class InfoFieldComponent implements OnInit {

  constructor() { }

  @Input() public label: string;
  @Input() public value: any;


  ngOnInit(): void {
  }

}
