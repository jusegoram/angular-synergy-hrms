import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveRowDetailsComponent } from './leave-row-details.component';

describe('LeaveRowDetailsComponent', () => {
  let component: LeaveRowDetailsComponent;
  let fixture: ComponentFixture<LeaveRowDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveRowDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveRowDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
