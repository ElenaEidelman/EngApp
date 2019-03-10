import { TestBed } from '@angular/core/testing';

import { ProfileGuardService } from './profile-guard.service';

describe('ProfileGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProfileGuardService = TestBed.get(ProfileGuardService);
    expect(service).toBeTruthy();
  });
});
