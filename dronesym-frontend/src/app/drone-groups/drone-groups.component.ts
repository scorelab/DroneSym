import { Component } from '@angular/core';
import { DroneDataService } from '../drone-service/drone-data.service';
import { UserService } from '../user-service/user.service';
import { DronesBoxComponent } from '../drones-box/drones-box.component';

declare var Materialize: any;

@Component({
  selector: 'app-drone-groups',
  templateUrl: './drone-groups.component.html',
  styleUrls: ['./drone-groups.component.css']
})
export class DroneGroupsComponent {
	userRole :string;
	groups: any;
	showGroupDialog: boolean;
	showDronesDialog: boolean;
	drones: any;
	currGroup: string;

	constructor(private droneFeed: DroneDataService, private userService: UserService) {
		this.userRole = "";
		this.showGroupDialog = false;
		this.showDronesDialog = false;
		this.drones = [];

		this.initialize();
	}

	private initialize(){
		this.userService.getUserRole()
			.then((role) => this.userRole = role)
			.catch((err) => console.log(err));

		this.droneFeed.getGroups()
			.then((res) => {
				this.groups = res.groups;
				console.log(this.groups);
			})
			.catch((err) => console.log(err))

		this.droneFeed.getDroneFeed()
			.subscribe((drones) => { this.drones = drones });
	}


	createGroup($event){
		if($event.message === 'DIALOG_CONFIRM'){
			this.droneFeed.createGroup($event.name)
				.then((res) => {
					if(res.status === "ERROR"){
						Materialize.toast(res.msg, 4000);
						return;
					}
					this.groups.push(res.group);
				});
		}
		this.showGroupDialog = false;
	}

	showCreateGroupDialog(){
		this.showGroupDialog = true;
	}

	showSelectDronesDialog(groupId){
		this.showDronesDialog = true;
		this.currGroup = groupId;
	}

	addDronesToGroup($event){
		if($event.action === "DRONES_BOX_CONFIRM" && $event.items.length > 0){
			this.droneFeed.addToGroup(this.currGroup, $event.items)
				.then((res) => {
					console.log(res.group);
					let newGroup = res.group;
					this.groups = this.groups.map((group) => group._id === newGroup._id ? newGroup : group);
				});
		}
		this.showDronesDialog = false;
		this.currGroup = "";
	}

	removeGroup(groupId){
		this.droneFeed.removeGroup(groupId)
			.then((res) => {
				console.log(res);
				Materialize.toast(`Deleted group ${res.group.name}`, 4000);
				this.groups = this.groups.filter((group) => group._id !== res.group._id);
			})
			.catch((err) => {
				console.log(err);
			})
	}

	removeFromGroup(groupId, droneId){
		this.droneFeed.removeFromGroup(groupId, droneId)
			.then((res) => {
				console.log(res);
				let newGroup = res.group;
				this.groups = this.groups.map((group) => group._id === newGroup._id ? newGroup : group);
			})
	}

	getName(droneId){
		return this.drones.filter((drone) => drone.key === droneId)
						  .map((drone) => drone.name);
	}


}
