import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MaterializeAction } from 'angular2-materialize';

@Component({
  selector: 'app-drone-option-box',
  templateUrl: './drone-option-box.component.html',
  styleUrls: ['./drone-option-box.component.css']
})
export class DroneOptionBoxComponent implements OnInit {

  droneState: string;
  droneHeading: number;
  droneSpeed: number;
  droneAlt: number;

  @Output('onSelected') onSelected = new EventEmitter<string>();
  @Input('name') droneName: string;
  @Input('description') droneDescription: string;

  @Input()
  set state(state: string) {
    this.droneState = state || 'FINISHED';
  }
  @Input()
  set altitude(value: number) {
    this.droneAlt = value || 0;
  }
  @Input()
  set heading(value: number) {
    this.droneHeading = value || 0;
  }
  @Input()
  set airspeed(value: number) {
    this.droneSpeed = value || 0;
  }

  constructor() {
    this.droneState = 'FINISHED';
  }

  ngOnInit() {
  }

  public onWaypoints() {
    this.onSelected.emit('SELECT_WAYPOINTS');
  }

  public onTakeoff() {
    this.onSelected.emit('SELECT_TAKEOFF');
  }

  public onResume() {
    this.onSelected.emit('SELECT_RESUME');
  }

  public onCancel() {
    this.onSelected.emit('SELECT_CANCEL');
  }

}
