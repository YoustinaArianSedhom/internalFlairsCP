import {
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpEvent
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { Logout, RefreshToken, } from '@core/auth/state/auth.actions';
import { ApiResponse, ErrorModel } from "../apis.model";
import { SSAConfigInst } from "src/app/config/app.config";
import { ModalsService } from "@shared/modules/modals/model/modals.service";
import { Router } from "@angular/router";
import { SnackBarsService } from "@shared/modules/snackbars/snackbars.service";
import { of } from "rxjs/internal/observable/of";



@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
  constructor(
    private readonly _modals: ModalsService,
    private readonly _snacks: SnackBarsService,
    private readonly _store: Store,
    private readonly _router: Router
  ) { }

  private _codes = SSAConfigInst.CRUD_CONFIG.errorsTypes;
  private _messages = SSAConfigInst.CRUD_CONFIG.errorsMessages;
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse | HttpResponse<ApiResponse>) => {
        /* Handle http errors and business logic related errors */

       


        /**
         * Deactivated and Archived Users
         */
        if (error.status === this._codes.lockedToken) {
          this._router.navigate([SSAConfigInst.ROUTES_CONFIG.login]);
          this._store.dispatch(new Logout);
          return throwError(error);
        }

        /**
         * Authentication
         * @todo Set maximum for number of tries
         */
        else if (error.status === this._codes.notAuthenticated) {
          this._store.dispatch(new RefreshToken);
          // return throwError(error);
          return throwError(error);
        }



        /**
         * Authorization
         */
        else if (error.status === this._codes.forbidden) {
          this._store.dispatch(new Navigate([SSAConfigInst.ROUTES_CONFIG.forbidden]));
          return throwError(error);
        }

        /**
         * @todo Think about it again
         */
        // else if (error.status === this._codes.notFound) {
        //   // if (request.url.includes('Organizations/GetOrganizationImageAsBase64')) return throwError(error);
        //   // this._dialog.openFailDialog(this._messages.notFound, 5);
        //   // this._store.dispatch(new Navigate(['notFound']));
        //   return throwError(error);
        // }

        // Incase of network issue or server down
        else if (error.status === this._codes.networkOrServer) {
          this._modals.openFailDialog(this._messages.networkOrServer, 5);
          return throwError(error);
        }


        // Incase of any other error
        else if (error instanceof HttpErrorResponse) {
          const { errors, errorMessage, errorCode }: ErrorModel = error.error;
          let content = '';

          // Incase list of errors
          if (errors && errors.length) errors.forEach(err => content += `${err} \n`);
          // Incase single line of error
          else if (errorMessage != null) content = errorMessage;
          // Incase there's no feedback provided
          else content = this._messages.generalFail;


          // If not validation error
          if (errorCode != 1 && !request.url.includes("openid-configuration")) this._snacks.openFailureSnackbar({message: content, duration: 7})
          

          return throwError(error);
        } 
        else {
          return throwError(error)
        }


      })
    );
  }
}
