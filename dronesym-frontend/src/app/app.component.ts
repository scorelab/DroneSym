import { Component, ViewChild, AfterViewInit, NgZone } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { DroneDataService } from './drone-service/drone-data.service';

import { CursorTooltipComponent } from './cursor-tooltip/cursor-tooltip.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { DroneOptionBoxComponent } from './drone-option-box/drone-option-box.component';

declare var google: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  @ViewChild('map') mapRef;

  centerCoords = { lat: 6.9023, lon: 79.8613 };
  cursor: any = { lat: 0, lon: 0, x: 0, y: 0 };

  drones = [];
  currDrone: any;
  map: any;

  createModes = { 'NONE': 0, 'DRONES': 1, 'WAYPOINTS': 2 };
  createMode: number;

  dialogParams = {
    droneDialog: { show: false },
    waypointDialog: { show: false }
  }

  constructor(private droneFeed: DroneDataService, private _zone: NgZone) {
    this.droneFeed.getDroneFeed()
        .subscribe((data) => {
          this.drones = data;
          console.log(data);
        });

    this.createMode = this.createModes.NONE;
  }

  ngAfterViewInit(){
    this.mapRef.mapReady.subscribe((map) => {
      this.map = map;

      this.map.addListener('mousemove', (e) => {
         this._zone.run(() => {
           this.cursor.lat = e.latLng.lat();
           this.cursor.lon = e.latLng.lng();
           this.cursor.x = e.pixel.x;
           this.cursor.y = e.pixel.y;
         })
      });

      this.map.addListener('click', (e) => {
        if(this.createMode === this.createModes.DRONES){
          this._zone.run(() => {
            this.dialogParams.droneDialog.show = true;
            this.centerCoords.lat = e.latLng.lat();
            this.centerCoords.lon = e.latLng.lng();
            console.log('Create Drone Mode');
          })
        }

        else if(this.createMode === this.createModes.WAYPOINTS){
          this._zone.run(() => {
            this.currDrone.waypoints.push({ 'lat': e.latLng.lat(), 'lon': e.latLng.lng() })
            console.log(this.currDrone.waypoints);
          })
        }
      })
    });
  }

  private switchCreateMode(mode: number){
    this.createMode = mode;

    if(mode != this.createModes.NONE){
      this.map.setOptions({ draggableCursor: 'crosshair' });
    }
  }

  public setCurrentDrone(drone){
    this.currDrone = drone;
    console.log(this.currDrone);
  }

  public goToCreateDroneMode() {
    this.switchCreateMode(this.createModes.DRONES);
  }

  public finishAddingWaypoints(){
    this.switchCreateMode(this.createModes.NONE);
    this.droneFeed.updateDroneWaypoints(this.currDrone.key, this.currDrone.waypoints)
        .then((status) => console.log(status));
  }

  public takeOffDrone(){
    this.droneFeed.takeOffDrone(this.currDrone.key, this.currDrone.waypoints)
        .then((status) => console.log(status));
  }

  public cancelAddingWaypoints(){
    this.switchCreateMode(this.createModes.NONE);
    this.currDrone.waypoints = [this.currDrone.waypoints[0]]
  }

  public createDrone(location){
    this.droneFeed.createDrone(location)
        .then((res) => console.log(res));
  }

  public processDialogResponse($data){
    if(this.createMode === this.createModes.DRONES){
      if($data === 'DIALOG_CONFIRM'){
        this.createDrone(this.centerCoords);
      }
    }

    this.map.setOptions({ draggableCursor: null });
    this.dialogParams.droneDialog.show = false;
    this.createMode = this.createModes.NONE;
  }

   public processDroneBox($data){
     if($data === "SELECT_WAYPOINTS"){
        this.switchCreateMode(this.createModes.WAYPOINTS);
        console.log("Waypoints mode");
     }

     else if($data === "SELECT_TAKEOFF"){
       this.takeOffDrone();
       console.log("Taking off");
     }
  }
}
