import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentLogsTableComponent } from './recent-logs-table.component';

xdescribe('RecentLogsTableComponent', () => {
  let component: RecentLogsTableComponent;
  let fixture: ComponentFixture<RecentLogsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecentLogsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentLogsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
