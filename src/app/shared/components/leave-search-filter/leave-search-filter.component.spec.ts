import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveSearchFilterComponent } from './leave-search-filter.component';

describe('LeaveSearchFilterComponent', () => {
  let component: LeaveSearchFilterComponent;
  let fixture: ComponentFixture<LeaveSearchFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveSearchFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveSearchFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
