import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyEditDialogComponent } from './family-edit-dialog.component';

describe('FamilyEditDialogComponent', () => {
  let component: FamilyEditDialogComponent;
  let fixture: ComponentFixture<FamilyEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FamilyEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
