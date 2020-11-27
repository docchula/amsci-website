import { TestBed, inject, waitForAsync } from '@angular/core/testing';

import { TeamGuard } from './team.guard';

describe('TeamGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TeamGuard]
    });
  });

  it('should ...', inject([TeamGuard], (guard: TeamGuard) => {
    expect(guard).toBeTruthy();
  }));
});
