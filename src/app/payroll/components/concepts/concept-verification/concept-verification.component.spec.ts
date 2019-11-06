import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptVerificationComponent } from './concept-verification.component';

describe('ConceptVerificationComponent', () => {
  let component: ConceptVerificationComponent;
  let fixture: ComponentFixture<ConceptVerificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConceptVerificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
