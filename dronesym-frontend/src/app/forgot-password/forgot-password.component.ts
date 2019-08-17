import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { UserService } from '../user-service/user.service';
import { Router } from '@angular/router';

declare var Materialize: any;
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  private user: any = {};
  http: any;
  baseUrl: any;
  userRole: any;
  genCode: string;
  dialogParams = {
    codeDialog: { show: false },
    passDialog: {show: false}
  };
  validUser: boolean;

  constructor(private router: Router, private userService: UserService) {
    this.user.username = '';
  }
  setUsername($event) {
    this.user.username = $event.target.value;
  }
  generateCode() {
    // const min = 0;
    // const max = 9;
    // let rand;
    // let num = '';
    const length = 10;
    let result           = '';
   const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   const charactersLength = characters.length;
   for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   console.log(result);
   return result;


}
  ngOnInit() {
  }
  // public createDrone(name, description, flying_time, location) {
  //   this.droneFeed.createDrone(name, description, flying_time, location)
  //       .then((res) => {
  //         if (res.status === 'ERROR') {
  //           console.log(res);
  //           Materialize.toast(res.msg, 4000);
  //         }
  //       });
  // }

  // public processDialogResponse($data) {
  //   console.log($data);
  //   if (this.createMode === this.createModes.DRONES) {
  //     if ($data.message === 'DIALOG_CONFIRM') {
  //       this.createDrone($data.name, $data.description, $data.flying_time, this.centerCoords);
  //     }
  //   }

  //   this.map.setOptions({ draggableCursor: null });
  //   this.dialogParams.droneDialog.show = false;
  //   this.createMode = this.createModes.NONE;
  // }
  sendEmail(code){
    this.userService.sendEmail(this.genCode)
    .then((res) => {

    });
  }
  checkUser($event) {
    $event.preventDefault();
    this.userService.checkUser(this.user.username)
        .then((res) => {
          if (res.status === 'OK') {
            this.validUser = true;
              this.genCode = this.generateCode();
              this.sendEmail(this.genCode);
              this.dialogParams.codeDialog.show = true;
          } else {
            Materialize.toast(res.msg, 4000);
          }
        });
  }
  public processDialogResponse($data) {
    console.log('Generated :' + this.genCode);
    console.log($data);
    if (this.validUser === true) {
      if ($data.message === 'DIALOG_CONFIRM') {
        if ($data.code === this.genCode) {
            this.dialogParams.passDialog.show = true;
      } else {
        Materialize.toast('Invalid code', 4000);
      }
    } else {
      Materialize.toast('Dialog canceled!', 4000);
    }
    this.dialogParams.codeDialog.show = false;
  }
  if (this.user.password !== this.user.retype) {
    Materialize.toast('Retype password does not match', 3000);
    return;
  }

  }
  public processPassDialogResponse($data) {
    console.log($data);
    if($data.pass !== $data.retype){
      Materialize.toast('Retype password does not match', 3000);
      return;
    } else {
      this.userService.updatePass(this.user.uname, this.user.password)
        .then((status) => {
          if (status.status === 'OK') {
            Materialize.toast('Password updated successfully', 4000);

          } else if (status.status === 'ERROR') {
            Materialize.toast(status.msg, 4000);
          }
        }, (err) => {
          Materialize.toast('Oops something went wrong...', 4000);
          console.log(err);
        });
    }


  }
}
