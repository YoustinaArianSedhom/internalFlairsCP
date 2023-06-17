import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { SpinnerService } from "@core/modules/spinner/spinner.service";
import { Store } from '@ngxs/store';
import { SpinnerState } from './state/spinner.state';
@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {
  constructor(
    private spinnerService: SpinnerService,
    private _store: Store) { }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const excludedUrls: string[] = this._store.selectSnapshot(SpinnerState.excludedUrls);
    let isExcluded = false;
    let index = 0;
    while ((isExcluded == false && index < excludedUrls?.length)) {
      if (req.url.toLowerCase().includes(excludedUrls[index].toLowerCase())) isExcluded = true;
      index++;
    }
    if (!isExcluded) {
      this.spinnerService.show();
      return next.handle(req).pipe(finalize(() => this.spinnerService.hide()));
    }
    return next.handle(req);
  }
}
