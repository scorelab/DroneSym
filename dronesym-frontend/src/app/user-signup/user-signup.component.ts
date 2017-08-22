import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user-service/user.service';
import { MaterializeAction } from 'angular2-materialize';

declare var Materialize;

@Component({
  selector: 'user-signup',
  templateUrl: './user-signup.component.html',
  styleUrls: ['./user-signup.component.css']
})
export class UserSignupComponent implements OnInit {

  modalActions = new EventEmitter<string|MaterializeAction>();

  @Output('onResponse') onResponse = new EventEmitter<any>();
  @Input()
  set show(show: boolean){
    if(show){
      this.modalActions.emit({ action: 'modal', params:['open']});
    }
    else{
      this.modalActions.emit({ action: 'modal', params:['close']});
      this.onResponse.emit({ status : "CLOSED" });
    }
  }


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
            Materialize.toast("User created successfully", 4000);
            this.modalActions.emit({ action: 'modal', params:['close']});
            this.onResponse.emit({ status : "CLOSED" });
          }
          else if(status.status === "ERROR"){
            Materialize.toast(status.msg, 4000);
            this.onResponse.emit({ status : "ERROR", msg : status.msg });
          }
        }, (err) => {
          Materialize.toast("Oops something went wrong...", 4000);
          this.onResponse.emit({ status : "ERROR", msg : err });
          console.log(err);
        })
    console.log(this.user);
  }

  public onRoleSelect($event){
    let role = $event.target.value.toLowerCase();
    this.user.role = role;
    console.log(this.user);
  }

  public cancel() {
    this.onResponse.emit({ status : "CANCEL" });
  }

}
