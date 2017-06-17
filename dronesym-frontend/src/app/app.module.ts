import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { environment } from '../environments/environment'

import { AppComponent } from './app.component';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AgmCoreModule.forRoot({
    	apiKey: environment.mapsApiKey
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
