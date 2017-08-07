import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DronesBoxComponent } from './drones-box.component';

describe('DronesBoxComponent', () => {
  let component: DronesBoxComponent;
  let fixture: ComponentFixture<DronesBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DronesBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DronesBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
