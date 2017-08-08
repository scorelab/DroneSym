import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { environment } from '../environments/environment';
import { MaterializeModule } from 'angular2-materialize';
import { HttpModule } from '@angular/http';
import { AuthHttpService } from './auth-http/auth-http.service';
import { RouterModule, Routes} from '@angular/router';
import { AppRouter } from './app-router';

import { AppComponent } from './app.component';
import { AgmCoreModule } from '@agm/core';
import { DroneDataService } from './drone-service/drone-data.service';
import { UserService } from './user-service/user.service';
import { RouteGuardService } from './route-guard/route-guard.service';
import { AdminAuthorizeService } from './admin-authorize/admin-authorize.service';

import { CursorTooltipComponent } from './cursor-tooltip/cursor-tooltip.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { DroneOptionBoxComponent } from './drone-option-box/drone-option-box.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { UserSignupComponent } from './user-signup/user-signup.component';
import { UserViewComponent } from './user-view/user-view.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { DroneGroupsComponent } from './drone-groups/drone-groups.component';
import { DroneListComponent } from './drone-list/drone-list.component';
import { DronesBoxComponent } from './drones-box/drones-box.component';

@NgModule({
  declarations: [
    AppComponent,
    CursorTooltipComponent,
    ConfirmDialogComponent,
    DroneOptionBoxComponent,
    DashboardComponent,
    LoginComponent,
    UserSignupComponent,
    UserViewComponent,
    UserDashboardComponent,
    DroneGroupsComponent,
    DroneListComponent,
    DronesBoxComponent
  ],
  imports: [
    BrowserModule,
    MaterializeModule,
    HttpModule,
    AgmCoreModule.forRoot({
    	apiKey: environment.mapsApiKey
    }),
    AppRouter
  ],
  providers: [
    DroneDataService,
    UserService,
    AuthHttpService,
    RouteGuardService,
    AdminAuthorizeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
