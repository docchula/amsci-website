import { TestBed, inject } from '@angular/core/testing';

import { UserStatusService } from './user-status.service';

describe('UserStatusService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserStatusService]
    });
  });

  it('should ...', inject([UserStatusService], (service: UserStatusService) => {
    expect(service).toBeTruthy();
  }));
});
