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

  sendEmail(code){
    this.userService.sendEmail(code)
    .then((res) => {

    });
  }
  checkUser($event) {
    this.genCode = this.generateCode();
    $event.preventDefault();
    this.userService.checkUser(this.user.username)
        .then((res) => {
          if (res.status === 'OK') {
            this.validUser = true;
              this.sendEmail(this.genCode);
              this.dialogParams.codeDialog.show = true;
          } else {
            Materialize.toast(res.msg, 4000);
          }
        });
  }
  public processDialogResponse($data) {
    console.log('Generated :' + this.genCode);
    // ($data);
    if (this.validUser === true) {
      if ($data.message === 'DIALOG_CONFIRM') {
        if ($data.code === this.genCode) {
            this.dialogParams.passDialog.show = true;
      } else {
        Materialize.toast('Invalid code', 4000);
      }
    } else {
      Materialize.toast('Dialog canceled!', 4000);
      this.router.navigate(['/resetpassword']);
    }
    this.dialogParams.codeDialog.show = false;
  }
  }
  public processPassDialogResponse($data) {
    console.log($data);
    if ($data.pass !== $data.retype) {
      Materialize.toast('Retype password does not match', 3000);
      return;
    } else {
      console.log($data.pass);
      this.userService.updatePass(this.user.username, $data.pass)
        .then((status) => {
          if (status.status === 'OK') {
            Materialize.toast('Password updated successfully', 4000);
            this.router.navigate(['/login']);
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
