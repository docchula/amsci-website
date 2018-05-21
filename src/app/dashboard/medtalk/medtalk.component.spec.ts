import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedtalkComponent } from './medtalk.component';

describe('MedtalkComponent', () => {
  let component: MedtalkComponent;
  let fixture: ComponentFixture<MedtalkComponent>;

  beforeEach(async(() => {
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
