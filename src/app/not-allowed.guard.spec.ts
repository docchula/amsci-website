import { TestBed, inject, waitForAsync } from '@angular/core/testing';

import { NotAllowedGuard } from './not-allowed.guard';

describe('NotAllowedGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotAllowedGuard]
    });
  });

  it('should ...', inject([NotAllowedGuard], (guard: NotAllowedGuard) => {
    expect(guard).toBeTruthy();
  }));
});
