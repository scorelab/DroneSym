import { Component, OnInit } from '@angular/core';
import { UserService } from '../user-service/user.service';

@Component({
  selector: 'app-user-signup',
  templateUrl: './user-signup.component.html',
  styleUrls: ['./user-signup.component.css']
})
export class UserSignupComponent implements OnInit {

  private user :any;

  constructor(private userService :UserService) {
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
    console.log(this.user);
  }

  public onRoleSelect($event){
    let role = $event.target.value.toLowerCase();
    this.user.role = role;
    console.log(this.user);
  }

}
