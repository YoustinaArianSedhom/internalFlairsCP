import { Component, OnInit } from '@angular/core';
import { SSAConfigInst } from 'src/app/config/app.config';
import { ModalsService } from '@shared/modules/modals/model/modals.service';
import { Store } from '@ngxs/store';
import { UserState } from '@core/modules/user/state/user.state';
import { Router } from '@angular/router';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { loggedInUserModel } from '@core/modules/user/model/user.model';
import { environment } from '@environments/environment';
import { UserModel } from '@modules/user-management/model/user-management.models';


@Component({
  selector: 'app-user-nav',
  templateUrl: './user-nav.component.html',
  styleUrls: ['./user-nav.component.scss'],
})
export class UserNavComponent implements OnInit {
  constructor(
    private _modals: ModalsService,
    private _store: Store,
    private _router: Router
  ) { }
  public isOpened = false;
  public environment = environment

  ngOnInit(): void { }

  @ViewSelectSnapshot(UserState.user) public user: UserModel;


  public confirmLogout() {
    this.isOpened = !this.isOpened;
    this._modals.openConfirmationDialog(
      {
        title: SSAConfigInst.CRUD_CONFIG.actions.logout,
        class: 'danger',
        content: SSAConfigInst.CRUD_CONFIG.confirmationMessages.logout(),
        proceedText: SSAConfigInst.CRUD_CONFIG.actions.logout,
        cancelText: SSAConfigInst.CRUD_CONFIG.actions.cancel,
      },
      () => this._router.navigate([SSAConfigInst.ROUTES_CONFIG.logout])
    );
  }
}
