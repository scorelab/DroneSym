import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurosTooltipComponent } from './cursor-tooltip.component';

describe('CurosTooltipComponent', () => {
  let component: CurosTooltipComponent;
  let fixture: ComponentFixture<CurosTooltipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurosTooltipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurosTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
