import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlipUploadComponent } from './slip-upload.component';

describe('SlipUploadComponent', () => {
  let component: SlipUploadComponent;
  let fixture: ComponentFixture<SlipUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlipUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlipUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
