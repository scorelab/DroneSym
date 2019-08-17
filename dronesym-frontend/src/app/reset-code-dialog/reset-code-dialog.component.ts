import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';

@Component({
  selector: 'app-reset-code-dialog',
  templateUrl: './reset-code-dialog.component.html',
  styleUrls: ['./reset-code-dialog.component.css']
})
export class ResetCodeDialogComponent implements OnInit {
  modalActions = new EventEmitter<string|MaterializeAction>();
  code: string;
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
    this.code = '';
  }

  ngOnInit() {
  }

  public setCode($event) {
    this.code = $event.target.value;
  }
  public cancel() {
    this.onResponse.emit('DIALOG_CANCEL');
  }

  public confirm() {
    this.onResponse.emit({'message' : 'DIALOG_CONFIRM', 'code' : this.code});
  }


}
