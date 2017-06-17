import { TestBed, inject } from '@angular/core/testing';

import { DroneDataService } from './drone-data.service';

describe('DroneDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DroneDataService]
    });
  });

  it('should be created', inject([DroneDataService], (service: DroneDataService) => {
    expect(service).toBeTruthy();
  }));
});
