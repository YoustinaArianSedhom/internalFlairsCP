import { Injectable } from '@angular/core';
import { ApiResponse } from '@core/http/apis.model';
import { HttpService } from '@core/http/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProfileModel, loggedInUserModel } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private _http: HttpService
  ) {}

  private _endpoint = 'profiles';


  public getMyProfileDetails(): Observable<ProfileModel> {
    return this._http.fetch(`${this._endpoint}/GetMyProfileDetails`).pipe(
      map((res: ApiResponse<ProfileModel>) => res.result)
    )
  }

  public GetMyUserInfo(): Observable<loggedInUserModel> {
    return this._http.fetch('Auth/GetMyUserInfo').pipe(
      map((res: ApiResponse<loggedInUserModel>) => res.result)
    )
  }



}
