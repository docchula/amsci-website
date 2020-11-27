import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MedtalkComponent } from './medtalk.component';

describe('MedtalkComponent', () => {
  let component: MedtalkComponent;
  let fixture: ComponentFixture<MedtalkComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MedtalkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedtalkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
