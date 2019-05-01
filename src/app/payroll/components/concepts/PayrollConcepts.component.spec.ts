import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollConceptsComponent } from './payrollConcepts.component';

describe('PayrollConceptsComponent', () => {
  let component: PayrollConceptsComponent;
  let fixture: ComponentFixture<PayrollConceptsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayrollConceptsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollConceptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
