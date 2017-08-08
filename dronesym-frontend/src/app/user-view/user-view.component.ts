import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user-service/user.service';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css']
})
export class UserViewComponent implements AfterViewInit {

  constructor(private router: Router, private userService: UserService) { }

  ngAfterViewInit(){
  	this.router.navigate(['dashboard/map']);
  }

  logout(){
  	this.userService.logout();
  	this.router.navigate(['login']);
  }
}
