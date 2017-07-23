import { TestBed, inject } from '@angular/core/testing';

import { AdminAuthorizeService } from './admin-authorize.service';

describe('AdminAuthorizeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminAuthorizeService]
    });
  });

  it('should be created', inject([AdminAuthorizeService], (service: AdminAuthorizeService) => {
    expect(service).toBeTruthy();
  }));
});
