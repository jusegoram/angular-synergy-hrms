import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollEditDialogComponent } from './payroll-edit-dialog.component';

describe('PayrollEditDialogComponent', () => {
  let component: PayrollEditDialogComponent;
  let fixture: ComponentFixture<PayrollEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayrollEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
