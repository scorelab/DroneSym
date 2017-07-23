import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../user-service/user.service';

@Injectable()
export class RouteGuardService implements CanActivate{

  constructor(private userService: UserService, private router: Router) { }

  canActivate(){
  	return this.isAuthenticated();
  }

  private isAuthenticated(): Promise<boolean>{
  	return this.userService.isAuthenticated()
  		.then((res) => {
  			if(res) {
  				return true;
  			}
  			else{
  				this.router.navigate(['login']);
  				return false;
  			}
  		})
  		.catch((err) => {
  			this.router.navigate(['login']);
  			return false;
  		})
  }
}
