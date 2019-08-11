import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  http: any;
  baseUrl: any;
  userRole: any;

  constructor() { }

  ngOnInit() {
  }
  // public userCheck(username) {
  //   return this.http.post(`${this.baseUrl}/login`, { 'uname': username, 'password': password })
  //       .pipe(map((res) => {
  //         const status = res.json();
  //         if (status.status === 'OK') {
  //           localStorage.setItem('token', status.token);
  //           this.userRole = status.role;
  //         }
  //         return status;
  //        }))
  //       .toPromise();
  // }


}
