import { Injectable } from '@angular/core';
import { AuthHttpService } from '../auth-http/auth-http.service';
import { environment } from '../../environments/environment';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {

  private baseUrl: string;
  private userRole: string;

  constructor(private http: AuthHttpService) {
    this.baseUrl = `${environment.nodeApiURL}/user`;
  }

  public login(username, password){
    return this.http.post(`${this.baseUrl}/login`, { 'uname': username, 'password': password })
        .map((res) => {
          let status = res.json();
          if(status.status === "OK"){
            localStorage.setItem('token', status.token);
            this.userRole = status.role;
          }
          return status;
         })
        .toPromise();
  }

  public createUser(username, password, role){
    let user = { 'uname': username, 'password': password, 'role': role }
    return this.http.post(`${this.baseUrl}/create`,  user)
           .map((res) => res.json())
           .toPromise();
  }

  public isAuthenticated(): Promise<boolean>{
    let headers = new Headers();
    let token = localStorage.getItem('token');

    let authPromise = new Promise((resolve, reject) =>{
      if(!token || token === ''){
        resolve(false);
      }

      this.http.get(`${this.baseUrl}/authenticate`)
          .subscribe((res) => {
            let status = res.json();
            if(status === 'Authorized'){
              resolve(true);
            }
            else if(status === 'Unauthorized'){
              resolve(false);
            }
          }, (err) => {
            reject(err);
          })
    })

    return authPromise;
  }

  public logout(){
    localStorage.setItem('token', '');
    this.userRole = '';
  }

  public getUserRole(): Promise<string>{
    let promise = new Promise((resolve, reject) => {
      if(this.userRole){
        resolve(this.userRole);
        return;
      }

      this.http.get(`${this.baseUrl}/role`)
          .subscribe((res) => {
            let status = res.json();
            if(status.status === "OK"){
              this.userRole = status.role;
              resolve(status.role);
            }
            else{
              reject('ERROR');
            }
          }, (err) => {
            reject(err);
          })
    })

    return promise;
  }

  public getUserList() :Promise<any> {
    return this.http.get(`${this.baseUrl}/list`)
               .map((res) => res.json())
               .toPromise();
  }

}
