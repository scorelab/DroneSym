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

const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: UserViewComponent,
    canActivate: [
      RouteGuardService
    ],
    children: [
      {
        path: 'map',
        component: DashboardComponent,
        canActivate: [ RouteGuardService ]
      },
      {
        path: 'user',
        component: UserDashboardComponent,
        canActivate: [ RouteGuardService ],
        children: [
            {
              path: 'groups',
              component: DroneGroupsComponent,
              canActivate: [ RouteGuardService ]
            },
            {
              path: 'list',
              component: DroneListComponent,
              canActivate: [ RouteGuardService ]
            }
        ]
      }
    ]
  },
  {
    path: 'signup',
    component: UserSignupComponent,
    canActivate: [
      RouteGuardService,
      AdminAuthorizeService
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
]

@NgModule({
	imports: [
		RouterModule.forRoot(appRoutes)
	],
	exports: [
		RouterModule
	]
})

export class AppRouter {}