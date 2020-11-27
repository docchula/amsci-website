import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AcceptRulesComponent } from './accept-rules.component';

describe('AcceptRulesComponent', () => {
  let component: AcceptRulesComponent;
  let fixture: ComponentFixture<AcceptRulesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AcceptRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
