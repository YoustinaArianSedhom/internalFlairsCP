import { Component, OnInit } from '@angular/core';
import { AuthorizationState } from '@core/modules/authorization/state/authorization.state';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'customerPortal-tickets-wrapper',
  templateUrl: './tickets-wrapper.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class TicketsWrapperComponent implements OnInit {
  @ViewSelectSnapshot(AuthorizationState.isInternalAdmin)
  public isInternalAdmin: boolean;

  @ViewSelectSnapshot(AuthorizationState.isAdmin)
  public isAdmin: boolean;

  @ViewSelectSnapshot(AuthorizationState.isExternalAdmin)
  public isExternalAdmin: boolean;

  constructor() {}

  ngOnInit(): void {}
}
