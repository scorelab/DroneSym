import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabase } from 'angularfire2/database';
import { MaterializeModule } from 'angular2-materialize';

import { AppComponent } from './app.component';
import { AgmCoreModule } from '@agm/core';
import { DroneDataService } from './drone-service/drone-data.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MaterializeModule,
    AgmCoreModule.forRoot({
    	apiKey: environment.mapsApiKey
    }),
    AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [
    DroneDataService,
    AngularFireDatabase
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
