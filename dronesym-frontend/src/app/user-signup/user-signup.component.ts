import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user-service/user.service';

declare var Materialize;

@Component({
  selector: 'app-user-signup',
  templateUrl: './user-signup.component.html',
  styleUrls: ['./user-signup.component.css']
})
export class UserSignupComponent implements OnInit {

  private user :any;

  constructor(private userService :UserService, private router: Router) {
    this.user = { uname: '', password: '', retype: '', role: '' };
  }

  ngOnInit() { }

  public setUsername($event){
    this.user.uname = $event.target.value;
  }

  public setPassword($event){
    this.user.password = $event.target.value;
  }

  public setRetype($event){
    this.user.retype = $event.target.value;
  }

  public onSignup($event){
    $event.preventDefault();

    if(this.user.uname === "" || this.user.password === "" || this.user.retype === ""){
      Materialize.toast("All fields must be specified", 3000);
      return;
    }

    if(this.user.role === ""){
      Materialize.toast("Please specify a user role", 3000);
      return;
    }

    if(this.user.password != this.user.retype){
      Materialize.toast("Retype password does not match", 3000);
      return;
    }

    this.userService.createUser(this.user.uname, this.user.password, this.user.role)
        .then((status) => {
          if(status.status === "OK"){
            Materialize.toast("User created. Redirecting to dashboard...", 4000, '', () => {
              this.router.navigate(['dashboard']);
            });
          }
          else if(status.status === "ERROR"){
            Materialize.toast(status.msg, 4000);
          }
        }, (err) => {
          Materialize.toast("Oops something went wrong...", 4000);
          console.log(err);
        })
    console.log(this.user);
  }

  public onRoleSelect($event){
    let role = $event.target.value.toLowerCase();
    this.user.role = role;
    console.log(this.user);
  }

}
