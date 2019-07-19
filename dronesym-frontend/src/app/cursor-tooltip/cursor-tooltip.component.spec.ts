import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CursorTooltipComponent } from './cursor-tooltip.component';

describe('CursorTooltipComponent', () => {
  let component: CursorTooltipComponent;
  let fixture: ComponentFixture<CursorTooltipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CursorTooltipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CursorTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
