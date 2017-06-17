import { Component } from '@angular/core';
import { DroneDataService } from './drone-service/drone-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  constructor(private droneFeed: DroneDataService) {
    this.droneFeed.getDronesList()
        .subscribe((drones) => console.log(drones));
  }

  centerCoords = {
    lat: 6.9023,
    lng: 79.8613
  };

}
