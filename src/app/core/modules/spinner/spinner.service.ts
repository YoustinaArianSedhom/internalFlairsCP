import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Store } from '@ngxs/store';
import { ShowSpinner, HideSpinner, DeactivateSpinner, ActivateSpinner } from './state/spinner.actions';

@Injectable()
export class SpinnerService {
  constructor(
    private _store: Store
  ) {}
  isLoading = new Subject<boolean>();
  requestsCount = 0;
  public show() {
    this.requestsCount++;
    this._store.dispatch(new ShowSpinner);
  }
  public hide() {
    this.requestsCount--;
    if (this.requestsCount === 0) this._store.dispatch(new HideSpinner);
  }
  public deActivate() {
    this._store.dispatch(new DeactivateSpinner());
  }

  public activate() {
    this._store.dispatch(new ActivateSpinner());

  }
}
