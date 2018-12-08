import { Component } from '@angular/core';
import { DroneDataService } from '../drone-service/drone-data.service';

declare var Materialize;

@Component({
  selector: 'app-drone-list',
  templateUrl: './drone-list.component.html',
  styleUrls: ['./drone-list.component.css']
})


export class DroneListComponent {
  
  drones: any;
  showRenameConfirmation: boolean;
  showDeleteConfirmation: boolean;
  currDrone: any;

  constructor(private droneFeed: DroneDataService) {
    this.showDeleteConfirmation = false;
    this.showRenameConfirmation = false;
    this.drones = [];

  	this.droneFeed.getDroneFeed()
  		.subscribe((drones) => {
        if(this.drones.length != drones.length){
  			  this.drones = drones;          
        }
  		})
  }

  showDeleteConfirmationDialog(drone){
    this.currDrone = drone;
    this.showDeleteConfirmation = true;
    console.log('Delete drone');
  }

  deleteResponse($event){
    if($event.message === 'DIALOG_CONFIRM'){
      this.droneFeed.removeDrone(this.currDrone.key, this.currDrone.status)
          .then((res) => {
            console.log(res);

            if(res.status === "ERROR"){
              Materialize.toast(`Can't Delete : ${res.msg}`, 4000);
              return;
            }
            else if(res.status === "OK"){
              Materialize.toast('Drone removed from fleet', 4000);
            }
          })
          .catch((err) => {
            console.log(err);
          })
    }

    this.showDeleteConfirmation = false;
  }
}
