import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardDialogComponent } from './guard-dialog.component';

describe('GuardDialogComponent', () => {
  let component: GuardDialogComponent;
  let fixture: ComponentFixture<GuardDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuardDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
