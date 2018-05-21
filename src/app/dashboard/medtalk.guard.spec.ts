import { TestBed, async, inject } from '@angular/core/testing';

import { MedtalkGuard } from './medtalk.guard';

describe('MedtalkGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MedtalkGuard]
    });
  });

  it('should ...', inject([MedtalkGuard], (guard: MedtalkGuard) => {
    expect(guard).toBeTruthy();
  }));
});
