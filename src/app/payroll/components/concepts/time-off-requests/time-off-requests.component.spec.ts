import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeOffRequestsComponent } from './time-off-requests.component';

describe('TimeOffRequestsComponent', () => {
  let component: TimeOffRequestsComponent;
  let fixture: ComponentFixture<TimeOffRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeOffRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeOffRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
