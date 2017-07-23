import { Component, ViewChild, AfterViewInit, NgZone } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { DroneDataService } from './drone-service/drone-data.service';

import { CursorTooltipComponent } from './cursor-tooltip/cursor-tooltip.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { DroneOptionBoxComponent } from './drone-option-box/drone-option-box.component';

declare var google: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent { }
