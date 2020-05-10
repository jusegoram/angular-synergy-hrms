import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentUploadTableComponent } from './recent-upload-table.component';

describe('RecentUploadTableComponent', () => {
  let component: RecentUploadTableComponent;
  let fixture: ComponentFixture<RecentUploadTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecentUploadTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentUploadTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
