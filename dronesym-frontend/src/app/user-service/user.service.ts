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

  public setUserRole(role){
    this.userRole = role;
  }

  public getUserRole(): string{
    return this.userRole;
  }

}
