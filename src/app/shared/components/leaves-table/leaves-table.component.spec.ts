import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavesTableComponent } from './leaves-table.component';

describe('LeavesTableComponent', () => {
  let component: LeavesTableComponent;
  let fixture: ComponentFixture<LeavesTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeavesTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeavesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
