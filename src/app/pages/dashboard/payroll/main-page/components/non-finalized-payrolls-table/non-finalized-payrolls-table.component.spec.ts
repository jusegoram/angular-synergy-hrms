import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NonFinalizedPayrollsTableComponent } from './non-finalized-payrolls-table.component';

xdescribe('NonFinalizedPayrollsTableComponent', () => {
  let component: NonFinalizedPayrollsTableComponent;
  let fixture: ComponentFixture<NonFinalizedPayrollsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NonFinalizedPayrollsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonFinalizedPayrollsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
