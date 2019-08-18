import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';

@Component({
  selector: 'app-new-password-dialog',
  templateUrl: './new-password-dialog.component.html',
  styleUrls: ['./new-password-dialog.component.css']
})
export class NewPasswordDialogComponent implements OnInit {
  modalActions = new EventEmitter<string|MaterializeAction>();
  pass: any;
  @Output('onResponse') onResponse = new EventEmitter<any>();
  @Input('message') message: string;
  @Input('inputEnabled') inputEnabled: boolean;
  @Input()

  set show(show: boolean) {
    if (show) {
      this.modalActions.emit({ action: 'modal', params: ['open']});
    } else {
      this.modalActions.emit({ action: 'modal', params: ['close']});
    }
  }

  constructor() {
    this.pass = { password: '', retype: ''};
  }

  ngOnInit() {
  }
  public setPassword($event) {
    this.pass.password = $event.target.value;
  }

  public setRetype($event) {
    this.pass.retype = $event.target.value;
  }

  public cancel() {
    this.onResponse.emit('DIALOG_CANCEL');
  }

  public confirm() {
    if (this.pass.password === this.pass.retype) {
      this.onResponse.emit({'message' : 'DIALOG_CONFIRM', 'pass' : this.pass.password, 'retype' : this.pass.retype});
    }

  }


}
