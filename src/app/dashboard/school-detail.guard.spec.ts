import { TestBed, async, inject } from '@angular/core/testing';

import { SchoolDetailGuard } from './school-detail.guard';

describe('SchoolDetailGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SchoolDetailGuard]
    });
  });

  it('should ...', inject([SchoolDetailGuard], (guard: SchoolDetailGuard) => {
    expect(guard).toBeTruthy();
  }));
});
