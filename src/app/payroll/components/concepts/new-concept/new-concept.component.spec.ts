import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewConceptComponent } from './new-concept.component';

describe('NewConceptComponent', () => {
  let component: NewConceptComponent;
  let fixture: ComponentFixture<NewConceptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewConceptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewConceptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
