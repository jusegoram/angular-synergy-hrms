import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateLeaveModalComponent } from './generate-leave-modal.component';

describe('GenerateLeaveModalComponent', () => {
  let component: GenerateLeaveModalComponent;
  let fixture: ComponentFixture<GenerateLeaveModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateLeaveModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateLeaveModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
