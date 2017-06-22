import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';

@Component({
  selector: 'confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

  modalActions = new EventEmitter<string|MaterializeAction>();

  @Output('onResponse') onResponse = new EventEmitter<string>();

  @Input()
  set show(show: boolean){
    if(show){
      this.modalActions.emit({ action: 'modal', params:['open']});
    }
    else{
      this.modalActions.emit({ action: 'modal', params:['close']});
    }
  }

  constructor() { }

  ngOnInit() {
  }

  public cancel(){
    this.onResponse.emit('DIALOG_CANCEL');
  }

  public confirm(){
    this.onResponse.emit('DIALOG_CONFIRM');
  }
}
