import { TestBed, inject, waitForAsync } from '@angular/core/testing';

import { EmailVerifyGuard } from './email-verify.guard';

describe('EmailVerifyGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmailVerifyGuard]
    });
  });

  it('should ...', inject([EmailVerifyGuard], (guard: EmailVerifyGuard) => {
    expect(guard).toBeTruthy();
  }));
});
