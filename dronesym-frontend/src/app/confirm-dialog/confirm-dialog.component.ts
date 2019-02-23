import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';

@Component({
  selector: 'confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

  modalActions = new EventEmitter<string|MaterializeAction>();
  name: string;
  description: string;
  flying_time: string;

  @Output('onResponse') onResponse = new EventEmitter<any>();
  @Input('message') message: string;
  @Input('inputEnabled') inputEnabled: boolean;
  @Input('newDrone') newDrone: boolean;
  @Input()
  set show(show: boolean){
    if (show) {
      this.modalActions.emit({ action: 'modal', params: ['open']});
    } else {
      this.modalActions.emit({ action: 'modal', params: ['close']});
    }
  }

  constructor() {
    this.name = '';
    this.description = '';
    this.flying_time = '';
  }

  ngOnInit() {
  }

  public setName($event) {
    this.name = $event.target.value;
  }
  public setDescription($event) {
    this.description = $event.target.value;
  }
  public setFlyingTime($event) {
    this.flying_time = $event.target.value;
  }
  public cancel() {
    this.onResponse.emit('DIALOG_CANCEL');
  }

  public confirm() {
    this.onResponse.emit({'message' : 'DIALOG_CONFIRM', 'name' : this.name , 'description': this.description,'flying_time':this.flying_time});
  }
}
