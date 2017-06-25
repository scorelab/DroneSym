import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';

@Component({
  selector: 'drone-option-box',
  templateUrl: './drone-option-box.component.html',
  styleUrls: ['./drone-option-box.component.css']
})
export class DroneOptionBoxComponent implements OnInit {
  @Output('onSelected') onSelected = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  public onWaypoints(){
    this.onSelected.emit('SELECT_WAYPOINTS');
  }

  public onTakeoff(){
    this.onSelected.emit('SELECT_TAKEOFF');;
  }

}
