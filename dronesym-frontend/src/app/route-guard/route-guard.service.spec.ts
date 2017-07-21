import { TestBed, inject } from '@angular/core/testing';

import { RouteGuardService } from './route-guard.service';

describe('RouteGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RouteGuardService]
    });
  });

  it('should be created', inject([RouteGuardService], (service: RouteGuardService) => {
    expect(service).toBeTruthy();
  }));
});
