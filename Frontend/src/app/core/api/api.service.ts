import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, of, pipe} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {ApiError} from '../error-handling';
import {environment} from '../../../environments/environment';

const API_ROOT = environment.apiRoot;
const wrapError = catchError((err: HttpErrorResponse) => of(new ApiError(err)));

@Injectable({
  providedIn: 'root'
})
export class ApiService
{
  constructor(@Inject(HttpClient) private _http: HttpClient) { }

  public get(url: string): Observable<any>
  {
    return this._http.get(API_ROOT +  '/' + url).pipe(wrapError);
  }

  public post(url: string, body?: object)
  {
    return this._http.post(API_ROOT + '/' + url, body).pipe(wrapError);
  }

  public delete(url: string)
  {
    return this._http.delete(API_ROOT + '/' + url).pipe(wrapError);
  }

  public put(url: string, body: object)
  {
    return this._http.put(API_ROOT + '/' + url, body).pipe(wrapError);
  }
}
