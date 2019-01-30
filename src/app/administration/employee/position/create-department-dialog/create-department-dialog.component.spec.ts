import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDepartmentDialogComponent } from './create-department-dialog.component';

describe('CreateDepartmentDialogComponent', () => {
  let component: CreateDepartmentDialogComponent;
  let fixture: ComponentFixture<CreateDepartmentDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDepartmentDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDepartmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
