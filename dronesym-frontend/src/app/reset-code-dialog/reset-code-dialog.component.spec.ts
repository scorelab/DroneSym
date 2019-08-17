import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetCodeDialogComponent } from './reset-code-dialog.component';

describe('ResetCodeDialogComponent', () => {
  let component: ResetCodeDialogComponent;
  let fixture: ComponentFixture<ResetCodeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetCodeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetCodeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
