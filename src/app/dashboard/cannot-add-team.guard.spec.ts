import { TestBed, inject, waitForAsync } from '@angular/core/testing';

import { CannotAddTeamGuard } from './cannot-add-team.guard';

describe('CannotAddTeamGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CannotAddTeamGuard]
    });
  });

  it('should ...', inject([CannotAddTeamGuard], (guard: CannotAddTeamGuard) => {
    expect(guard).toBeTruthy();
  }));
});
