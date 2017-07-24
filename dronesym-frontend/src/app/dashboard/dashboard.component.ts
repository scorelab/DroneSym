import { Component, ViewChild, AfterViewInit, NgZone } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { DroneDataService } from '../drone-service/drone-data.service';
import { UserService } from '../user-service/user.service';

import { CursorTooltipComponent } from '../cursor-tooltip/cursor-tooltip.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { DroneOptionBoxComponent } from '../drone-option-box/drone-option-box.component';

declare var google: any;
declare var Materialize: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent{

  @ViewChild('map') mapRef;

  centerCoords = { lat: 6.9023, lon: 79.8613 };
  cursor: any = { lat: 0, lon: 0, x: 0, y: 0 };

  drones = [];
  droneIndices = [];
  trailIndices = [];

  currDrone: any;
  map: any;

  createModes = { 'NONE': 0, 'DRONES': 1, 'WAYPOINTS': 2 };
  createMode: number;

  userRole: string;
  waypointIcon: string;

  dialogParams = {
    droneDialog: { show: false },
    waypointDialog: { show: false }
  }

  constructor(private droneFeed: DroneDataService, private _zone: NgZone, private router: Router, private userService: UserService) {
    this.droneFeed.getDroneFeed()
        .subscribe((data) => {
          if(data.length > this.droneIndices.length){
            this.droneIndices = Array(data.length).fill(0).map((x, i) => i);
          }

          this.drones = data;
          this.updateCurrDrone();
        });

    this.userService.getUserRole()
        .then((role) => {
          this.userRole = role;
        });

    this.createMode = this.createModes.NONE;
    this.waypointIcon = './assets/img/blue.png';
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

        else if(this.createMode === this.createModes.NONE){
          this._zone.run(() => {
            this.currDrone = {};
            console.log(this.currDrone);
          });
        }
      })
    });
  }

  private switchCreateMode(mode: number){
    this.createMode = mode;

    if(mode != this.createModes.NONE){
      this.map.setOptions({ draggableCursor: 'crosshair' });
    }
    else{
      this.map.setOptions({ draggableCursor: null });
      this.waypointIcon = './assets/img/blue.png';
    }
  }

  private updateCurrDrone(){
    if(!this.currDrone){
      return;
    }

    let drone = this.drones.filter((drone) => {
      return drone.key === this.currDrone.key;
    })[0];

    this.currDrone.status = drone.status;
    this.currDrone.location.alt = drone.location.alt;
    this.currDrone.airspeed = drone.airspeed;
    this.currDrone.heading = drone.heading;
  }

  public setCurrentDrone(drone){
    this.currDrone = drone;
    console.log(this.currDrone);
  }

  public goToCreateDroneMode() {
    this.switchCreateMode(this.createModes.DRONES);
    Materialize.toast("Click on map to put drones", 4000);
  }

  public goToSignup(){
    this.router.navigate(['signup']);
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

  public cancelFlight(){
    this.droneFeed.landDrone(this.currDrone.key)
        .then((status) => console.log(status));
  }

  public resumeFlight(){
    this.droneFeed.resumeFlight(this.currDrone.key)
        .then((status) => console.log(status));
  }

  public cancelAddingWaypoints(){
    this.switchCreateMode(this.createModes.NONE);
    let currPosition = { 'lat': this.currDrone.location.lat, 'lon': this.currDrone.location.lon };
    this.currDrone.waypoints = [currPosition]
    this.droneFeed.updateDroneWaypoints(this.currDrone.key, this.currDrone.waypoints)
        .then((status) => console.log(status));
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
        Materialize.toast("Click on map to put waypoints", 4000);
     }

     else if($data === "SELECT_TAKEOFF"){
       this.takeOffDrone();
       console.log("Taking off");
     }

     else if($data === "SELECT_RESUME"){
       this.resumeFlight();
       console.log("Resuming...");

     }

     else if($data === "SELECT_CANCEL"){
       this.cancelFlight();
       console.log("Cancelling...");
     }
  }

  public deleteWaypoint(index){
    if(this.createMode === this.createModes.WAYPOINTS){
        this.currDrone.waypoints.splice(index, 1);
        this.droneFeed.updateDroneWaypoints(this.currDrone.key, this.currDrone.waypoints)
            .then((status) => console.log("Deleted"));
    }
  }

  public toggleAllTrails(){
    console.log('Trail toggle...');
    if(this.droneIndices.length > 0 && this.trailIndices.length == 0){
      this.droneIndices.forEach((droneIndex) => {
        this.trailIndices.push(droneIndex);
      })
    }
    else{
      this.trailIndices = [];
    }
  }

  public logout(){
    this.userService.logout();
    this.router.navigate(['login']);
  }

  public isAuthorized(roles){
    this.userService.getUserRole();
  }

  public changeWaypointIcon(isMouseOver){
    if(this.createMode === this.createModes.NONE){
      return;
    }

    if(isMouseOver){
      this.waypointIcon = './assets/img/red.png';
    }
    else{
      this.waypointIcon = './assets/img/blue.png';
    }
  }

  public landDrone(){
    this.droneFeed.landDrone(this.currDrone.key)
        .then((res) => console.log(res));
  }
}
