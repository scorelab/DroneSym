import { Component, OnInit } from '@angular/core';
import { UserSignupComponent } from '../user-signup/user-signup.component';
import { UserService } from '../user-service/user.service';
import { DroneDataService } from '../drone-service/drone-data.service';
import { DronesBoxComponent } from '../drones-box/drones-box.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  public showUserSignUpDialog: boolean;
  public showDroneGroupsDialog: boolean;
  public userRole;
  public users;
  public groups;
  public currUser;

  constructor(private userService: UserService, private droneService: DroneDataService) {
  this.showUserSignUpDialog = false;
    this.showDroneGroupsDialog = false;
    this.groups = [];
    this.users = [];
    this.currUser = '';

  userService.getUserRole().then((role) => {
  this.userRole = role;
  });

    userService.getUserList().then((users) => {
      this.users = users.users;
      // console.log(this.users);
    });

    droneService.getGroups().then((groups) => {
      // console.log(groups);
      this.groups = groups.groups.map((group) => {
        return {
          name : group.name,
          _id : group._id
        };
      });
    });
  }

  ngOnInit() {
  }

  private updateUser(userData) {
    this.users = this.users.map((user) => {
      // console.log(user);
      // console.log(userData);
      if (user._id === userData.id) {
        return userData;
      } else {
        return user;
      }
    });
  }
  private updateGroup(groupData) {
    this.groups = this.groups.map((groups) => {
      if (groups._id === groupData.id) {
        return groupData;
      } else {
        return groups;
      }
    });
  }

  public showCreateUserDialog() {
  this.showUserSignUpDialog = true;
  }

  public showGroupsDialog(userId) {
    this.showDroneGroupsDialog = true;
    this.currUser = userId;
  }

  public onDronesBoxResponse($event) {
    const groups = $event.items;
    // console.log(groups);

    groups.forEach((groupId) => {
      this.userService.addUserToGroup(this.currUser, groupId)
          .then((res) => {
            // console.log(res);
            this.updateUser(res.user);
          });
    });
    groups.forEach((groupId) => {
      this.userService.updateUserToGroup(this.currUser, groupId)
          .then((res) => {
            // console.log(res);
            this.updateGroup(res.user);
          });
    });

     this.showDroneGroupsDialog = false;
     this.currUser = '';
  }

  public onUserSignupResponse() {
    this.userService.getUserList().then((users) => {
      this.users = users.users;
    });
  this.showUserSignUpDialog = false;
  }

  public removeFromGroup(userId, groupId) {
    this.userService.removeUserFromGroup(userId, groupId)
        .then((res) => {
          this.updateUser(res.user);
        });
  }
}
