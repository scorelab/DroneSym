import { Component, OnInit, Input, ViewChild, OnChanges } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'cursor-tooltip',
  templateUrl: './cursor-tooltip.component.html',
  styleUrls: ['./cursor-tooltip.component.css']
})
export class CursorTooltipComponent implements OnInit {
  @ViewChild('tooltip') tooltip;
  @Input('latitude') latitude: number;
  @Input('longitude') longitude: number;

  @Input()
  set x(x: number){
  	let el = this.tooltip.nativeElement;
  	el.style.left = `${x}px`;
  }

  @Input()
  set y(y: number){
  	let el = this.tooltip.nativeElement;
  	el.style.top = `${y}px`;
  }


  constructor() { }

  ngOnInit() {
  }
}
