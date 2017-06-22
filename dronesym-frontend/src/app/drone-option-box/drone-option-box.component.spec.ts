import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DroneOptionBoxComponent } from './drone-option-box.component';

describe('DroneOptionBoxComponent', () => {
  let component: DroneOptionBoxComponent;
  let fixture: ComponentFixture<DroneOptionBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DroneOptionBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DroneOptionBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
