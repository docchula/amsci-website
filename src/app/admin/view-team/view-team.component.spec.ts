import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewTeamComponent } from './view-team.component';

describe('ViewTeamComponent', () => {
  let component: ViewTeamComponent;
  let fixture: ComponentFixture<ViewTeamComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
