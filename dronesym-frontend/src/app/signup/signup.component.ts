import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user-service/user.service';
import { MaterializeAction } from 'angular2-materialize';

declare var Materialize;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  private user: any;
  /** Regular expression for email validation */
  regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

  constructor(private userService: UserService, private router: Router) {
    this.user = { uname: '', email: '', password: '', retype: '', role: '' };
  }

  ngOnInit() {
  }
  public setUsername($event) {
    this.user.uname = $event.target.value;
  }
  public setEmail($event) {
    this.user.email = $event.target.value;
  }

  public setPassword($event) {
    this.user.password = $event.target.value;
  }

  public setRetype($event) {
    this.user.retype = $event.target.value;
  }
  public onRoleSelect($event) {
    const role = $event.target.value.toLowerCase();
    this.user.role = role;
  }
  public onSignup($event) {
    $event.preventDefault();

    if (this.user.uname === '' || this.user.password === '' || this.user.retype === '') {
      Materialize.toast('All fields must be specified', 3000);
      return;
    }

    if (!this.regexp.test(this.user.email)) {
      Materialize.toast('Please enter a valid Email Address', 3000);
      return;
    }

    if (this.user.role === '') {
      Materialize.toast('Please specify a user role', 3000);
      return;
    }

    if (this.user.password !== this.user.retype) {
      Materialize.toast('Retype password does not match', 3000);
      return;
    }

    this.userService.createUserFromSignup(this.user.uname, this.user.password, this.user.role, this.user.email)
        .then((status) => {
          if (status.status === 'OK') {
            Materialize.toast('User created successfully', 4000);

          } else if (status.status === 'ERROR') {
            Materialize.toast(status.msg, 4000);
          }
        }, (err) => {
          Materialize.toast('Oops something went wrong...', 4000);
          console.log(err);
        });
    console.log(this.user);
  }

}

