import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inner-page-layout',
  templateUrl: './inner-page-layout.component.html',
  styleUrls: ['./inner-page-layout.component.scss']
})
export class InnerPageLayoutComponent implements OnInit {

  constructor() { }

  @Input() public title: string = ''

  ngOnInit(): void {
  }

}
