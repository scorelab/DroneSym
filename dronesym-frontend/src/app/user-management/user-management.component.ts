import { Component, OnInit } from '@angular/core';
import { UserSignupComponent } from '../user-signup/user-signup.component';
import { UserService } from '../user-service/user.service';
import { DroneDataService } from '../drone-service/drone-data.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  public showUserSignUpDialog :boolean;
  public userRole;
  public users;
  public groups;

  constructor(private userService :UserService, private droneService :DroneDataService) {
  	this.showUserSignUpDialog = false;
  	userService.getUserRole().then((role) => {
  		this.userRole = role;
  	})

    userService.getUserList().then((users) => {
      this.users = users.users;
    })

    droneService.getGroups().then((groups) => {
      this.groups = groups;
    })
  }

  ngOnInit() {
  }

  public showCreateUserDialog() {
  	this.showUserSignUpDialog = true;
  }

  public onUserSignupResponse() {
    this.userService.getUserList().then((users) => {
      this.users = users.users;
    });
  	this.showUserSignUpDialog = false;
  }

}
