import { TestBed, inject } from '@angular/core/testing';

import { AuthHttpService } from './auth-http.service';

describe('AuthHttpService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthHttpService]
    });
  });

  it('should be created', inject([AuthHttpService], (service: AuthHttpService) => {
    expect(service).toBeTruthy();
  }));
});
