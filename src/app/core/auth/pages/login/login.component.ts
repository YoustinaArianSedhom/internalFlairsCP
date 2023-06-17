import { Component, OnInit } from '@angular/core';
import { Login } from '@core/auth/state/auth.actions';
import { HeadRefresherType } from '@core/services/head-refresher/head-refresher.models';
import { HeadRefresherService } from '@core/services/head-refresher/head-refresher.service';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, HeadRefresherType {

  constructor(
    private _store: Store,
    private _headRefresher: HeadRefresherService
  ) { }

  public headInformation = {
    title: 'Login'
  }

  ngOnInit(): void {
  }
  public login() {
    this._store.dispatch(new Login);
    this.refreshHeadInformation();
  }

  public refreshHeadInformation(): void {
    this._headRefresher.refresh(this.headInformation);
  }

}
