import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';

@Component({
  selector: 'drones-box',
  templateUrl: './drones-box.component.html',
  styleUrls: ['./drones-box.component.css']
})
export class DronesBoxComponent {

  modalActions = new EventEmitter<string|MaterializeAction>();
  selectedItems :any;

  @Input()
  set show(show: boolean){
    if(show){
      this.modalActions.emit({ action: 'modal', params:['open']});
    }
    else{
      this.modalActions.emit({ action: 'modal', params:['close']});
    }
  }

  @Input('drones') drones: any;
  @Input('message') message: string;
  @Output('onResponse') response = new EventEmitter<any>();

  constructor() {
    this.selectedItems = [];
  }

  toggleDrone(droneId){
    if(this.selectedItems.indexOf(droneId) == -1){
      this.selectedItems.push(droneId);
    }
    else{
      this.selectedItems = this.selectedItems.filter((id) => id != droneId);
    }
  }

  isSelected(droneId){
    return this.selectedItems.indexOf(droneId) > -1;
  }

  confirm(){
    this.response.emit({ action : 'DRONES_BOX_CONFIRM' , items : this.selectedItems });
    this.selectedItems = [];
  }

  cancel(){
    this.selectedItems = [];
    this.response.emit({ actions : 'DRONES_BOX_CANCEL'})
  }

}
