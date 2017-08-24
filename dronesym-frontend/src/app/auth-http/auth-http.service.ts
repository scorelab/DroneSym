import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/operator/map';
import 'rxjs/operator/share';

@Injectable()
export class AuthHttpService {

  constructor(private http: Http, private router: Router) { }

  private getAuthHeader(): Headers{
  	let token = localStorage.getItem('token');
  	let headers = new Headers();
  	headers.append('Authorization', token);

  	return headers;
  }

  private checkAuthorization(request: Observable<any>): Observable<any>{
    request.map((res) => {
      let json = res.json();
      if(json === 'Unauthorized'){
        this.router.navigate(['login']);
        return request;
      }
      else{
        return request;
      }
    }, (err) => {
      console.log(err)
      this.router.navigate(['login']);
      return request;
    });

    return request;
  }

  public get(url: string): Observable<any>{
  	let authHeader = this.getAuthHeader();
  	let request = this.http.get(url, { 'headers': authHeader });
    return this.checkAuthorization(request);
  }

  public post(url: string, data :any): Observable<any>{
  	let authHeader = this.getAuthHeader();
  	let request = this.http.post(url, data, { 'headers': authHeader });
    return this.checkAuthorization(request);
  }

}
