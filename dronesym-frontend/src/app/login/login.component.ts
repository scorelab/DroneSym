import { Component } from '@angular/core';

import { MaterializeAction } from 'angular2-materialize';
import { Router } from '@angular/router';
import { UserService } from '../user-service/user.service';

declare var Materialize: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private user: any = {};

  constructor(private router: Router, private userService: UserService) {
    this.user.username = '';
    this.user.password = '';
  }

  setUsername($event) {
    this.user.username = $event.target.value;
  }

  setPassword($event) {
    this.user.password = $event.target.value;
  }

  onLogin($event) {
    $event.preventDefault();
    this.userService.login(this.user.username, this.user.password)
        .then((res) => {
          if (res.status === 'OK') {
            this.router.navigate(['dashboard/map']);
          } else {
            Materialize.toast(res.msg, 4000);
          }
        });
  }

}
