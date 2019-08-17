import { Injectable } from '@angular/core';
import { AuthHttpService } from '../auth-http/auth-http.service';
import { environment } from '../../environments/environment';

import 'rxjs/add/operator/toPromise';
// import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';



@Injectable()
export class UserService {

  private baseUrl: string;
  private userRole: string;

  constructor(private http: AuthHttpService) {
    this.baseUrl = `${environment.nodeApiURL}/user`;
  }
  public updatePass(username, pass){
    const user = { 'uname': username, 'password': pass, };
    return this.http.post(`${this.baseUrl}/updatePass`, user)
           .pipe(map((res) => res.json()))
           .toPromise();
  }
  public sendEmail(code){
    return this.http.post(`${this.baseUrl}/sendEmail`, { 'code': code })
    .pipe(map((res) => {
      const status = res.json();
      console.log(status);
      return status;
     }))
    .toPromise();
  }
public checkUser(username){
  return this.http.post(`${this.baseUrl}/check`, { 'uname': username })
        .pipe(map((res) => {
          const status = res.json();
          console.log(status);
          return status;
         }))
        .toPromise();
}
  public login(username, password) {
    return this.http.post(`${this.baseUrl}/login`, { 'uname': username, 'password': password })
        .pipe(map((res) => {
          const status = res.json();
          if (status.status === 'OK') {
            localStorage.setItem('token', status.token);
            this.userRole = status.role;
          }
          return status;
         }))
        .toPromise();
  }

  public createUser(username, email, password, role) {
    const user = { 'uname': username, 'email': email, 'password': password, 'role': role };
    return this.http.post(`${this.baseUrl}/create`,  user)
           .pipe(map((res) => res.json()))
           .toPromise();
  }
  public createUserFromSignup(username, password, role, email) {
    const user = { 'uname': username, 'password': password, 'role': role, 'email': email };
    return this.http.post(`${this.baseUrl}/createuser`, user)
           .pipe(map((res) => res.json()))
           .toPromise();
  }

  public isAuthenticated(): Promise<any> {
    const headers = new Headers();
    const token = localStorage.getItem('token');

    const authPromise = new Promise((resolve, reject) => {
      if (!token || token === '') {
        resolve(false);
      }

      this.http.get(`${this.baseUrl}/authenticate`)
          .subscribe((res) => {
            const status = res.json();
            if (status === 'Authorized') {
              resolve(true);
            } else if (status === 'Unauthorized') {
              resolve(false);
            }
          }, (err) => {
            reject(err);
          });
    });

    return authPromise;
  }

  public logout() {
    localStorage.setItem('token', '');
    this.userRole = '';
  }

  public getUserRole(): Promise<any> {
    const promise = new Promise((resolve, reject) => {
      if (this.userRole) {
        resolve(this.userRole);
        return;
      }

      this.http.get(`${this.baseUrl}/role`)
          .subscribe((res) => {
            const status = res.json();
            if (status.status === 'OK') {
              this.userRole = status.role;
              resolve(status.role);
            } else {
              reject('ERROR');
            }
          }, (err) => {
            reject(err);
          });
    });

    return promise;
  }

  public getUserList(): Promise<any> {
    return this.http.get(`${this.baseUrl}/list`)
               .pipe(map((res) => res.json()))
               .toPromise();
  }

  public addUserToGroup(userId, groupId): Promise<any> {
    return this.http.post(`${this.baseUrl}/${groupId}/add`, { userId : userId })
               .pipe(map((res) => res.json()))
               .toPromise();
  }

  public updateUserToGroup(userId, groupId): Promise<any> {
    return this.http.post(`${this.baseUrl}/${groupId}/updategroup`, { userId : userId })
               .pipe(map((res) => res.json()))
               .toPromise();
  }

  public removeUserFromGroup(userId, groupId): Promise<any> {
    return this.http.post(`${this.baseUrl}/${groupId}/remove`, { userId : userId })
               .pipe(map((res) => res.json()))
               .toPromise();
  }

}
