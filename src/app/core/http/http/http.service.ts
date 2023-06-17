import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

/**
 * @todo Provide new ability to set base url manually  instead of setting it automatically
 */
@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}
  public _baseURL = environment.apiUrl;

  public fetch(url: string, options = {}): Observable<any> {
    return this.http.get(this._formatUrl(url), options);
  }

  public post(url: string, data: object = {}, options = {}): Observable<any> {
    return this.http.post(this._formatUrl(url), data, options);
  }
  public request(
    url: string,
    data: object = {},
    options = {}
  ): Observable<any> {
    const req = new HttpRequest('POST', url, data, options);
    return this.http.request(req);
  }

  public delete(url: string, options = {}): Observable<any> {
    return this.http.delete(this._formatUrl(url), options);
  }

  public patch(url: string, data: object, options = {}): Observable<any> {
    return this.http.put(this._formatUrl(url), data, options);
  }

  private _formatUrl(endpoint: string) {
    return this._baseURL + endpoint;
  }
}
