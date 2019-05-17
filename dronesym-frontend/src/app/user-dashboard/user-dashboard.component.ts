import { Component, OnInit } from '@angular/core';
import { UserService } from '../user-service/user.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {

  public userRole: string;

  constructor(private userService: UserService) {
  userService.getUserRole().then((role) => {
  this.userRole = role;
  });
  }

  ngOnInit() {
  }

}
