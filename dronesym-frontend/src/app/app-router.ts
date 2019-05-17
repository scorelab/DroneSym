import { NgModule } from '@angular/core';
import { RouterModule, Routes, RouterStateSnapshot } from '@angular/router';
import { RouteGuardService } from './route-guard/route-guard.service';
import { AdminAuthorizeService } from './admin-authorize/admin-authorize.service';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserSignupComponent } from './user-signup/user-signup.component';
import { UserViewComponent } from './user-view/user-view.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { DroneGroupsComponent } from './drone-groups/drone-groups.component';
import { DroneListComponent } from './drone-list/drone-list.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { SignupComponent } from './signup/signup.component';

const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'dashboard',
    data: {
      breadcrumb: 'Dashboard'
    },
    component: UserViewComponent,
    canActivate: [
      RouteGuardService
    ],
    children: [
      {
        path: 'map',
        data: {
          breadcrumb: 'Map'
      },
        component: DashboardComponent,
        canActivate: [RouteGuardService]
      },
      {
        path: 'user',
        data: {
          breadcrumb: 'User'
      },
        component: UserDashboardComponent,
        canActivate: [RouteGuardService],
        children: [
          {
            path: 'groups',
            data: {
              breadcrumb: 'Manage Groups'
          },
            component: DroneGroupsComponent,
            canActivate: [RouteGuardService]
          },
          {
            path: 'list',
            data: {
              breadcrumb: 'Manage Drones'
          },
            component: DroneListComponent,
            canActivate: [RouteGuardService]
          },
          {
            path: 'users',
            data: {
              breadcrumb: 'Manage Users'
          },
            component: UserManagementComponent,
            canActivate: [RouteGuardService]
          }
        ]
      }
    ]
  },
  {
    path: '',
    component: LoginComponent
  },
  {
    path: '**',
    component: LoginComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class AppRouter {}
