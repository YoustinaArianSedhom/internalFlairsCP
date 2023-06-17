import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {
    constructor(
        private _store: Store
    ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        request = request.clone({
            headers: request.headers
            .set('Tenant-Key', 'flairstech')
        });
        return next.handle(request);
    }
}
