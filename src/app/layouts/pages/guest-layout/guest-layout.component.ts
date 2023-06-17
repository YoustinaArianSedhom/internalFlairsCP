import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-guest-layout',
  templateUrl: './guest-layout.component.html',
  styleUrls: ['./guest-layout.component.scss']
})
export class GuestLayoutComponent implements OnInit {

  constructor(private _router: Router) {
    this._router.navigate([{
      outlets: { 'side-panel': null }
    }])
  }

  ngOnInit(): void {
  }

}
