import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable , Operator } from 'rxjs';
// import 'rxjs/operator/map';
import 'rxjs/operator/share';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';
import { from } from 'rxjs';
@Injectable()
export class AuthHttpService {

  constructor(private http: Http, private router: Router) { }

  private getAuthHeader(): Headers{
  	const token = localStorage.getItem('token');
  	const headers = new Headers();
  	headers.append('Authorization', token);

  	return headers;
  }

  private checkAuthorization(request: Observable<any>): Observable<any> {
    request.pipe(map((res) => {
      const json = res.json();
      if (json === 'Unauthorized'){
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
    }));

    return request;
  }

  public get(url: string): Observable<any>{
  	const authHeader = this.getAuthHeader();
  	const request = this.http.get(url, { 'headers': authHeader });
    return this.checkAuthorization(request);
  }

  public post(url: string, data: any): Observable<any>{
  	const authHeader = this.getAuthHeader();
  	const request = this.http.post(url, data, { 'headers': authHeader });
    return this.checkAuthorization(request);
  }

}
