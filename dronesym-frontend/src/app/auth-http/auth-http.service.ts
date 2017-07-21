import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthHttpService {

  constructor(private http: Http) { }

  private getAuthHeader(): Headers{
  	let token = localStorage.getItem('token');
  	let headers = new Headers();
  	headers.append('Authorization', token);

  	return headers;
  }

  public get(url: string): Observable<any>{
  	let authHeader = this.getAuthHeader();
  	return this.http.get(url, { 'headers': authHeader });
  }

  public post(url: string, data :any): Observable<any>{
  	let authHeader = this.getAuthHeader();
  	return this.http.post(url, data, { 'headers': authHeader });
  }

}
