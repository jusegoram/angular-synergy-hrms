import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentActivitiesTableComponent } from './recent-activities-table.component';

xdescribe('RecentActivitiesTableComponent', () => {
  let component: RecentActivitiesTableComponent;
  let fixture: ComponentFixture<RecentActivitiesTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecentActivitiesTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentActivitiesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
