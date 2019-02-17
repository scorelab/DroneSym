import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UserService } from '../user-service/user.service';

@Injectable()
export class AdminAuthorizeService implements CanActivate {

  constructor(private router: Router, private userService: UserService) { }


  canActivate(){
  	return this.userService.getUserRole()
               .then((role) => {
                 if (role === 'admin'){
                   return true;
                 }
                 else{
                   this.router.navigate(['dashboard']);
                   return false;
                 }
               }, (err) => {
                 console.log(err);
                 this.router.navigate(['dashboard']);
                 return false;
               })
  }
}
