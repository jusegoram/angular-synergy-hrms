import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkpatternComponent } from './workpattern.component';

describe('WorkpatternComponent', () => {
  let component: WorkpatternComponent;
  let fixture: ComponentFixture<WorkpatternComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkpatternComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkpatternComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
