import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DroneGroupsComponent } from './drone-groups.component';

describe('DroneGroupsComponent', () => {
  let component: DroneGroupsComponent;
  let fixture: ComponentFixture<DroneGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DroneGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DroneGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
