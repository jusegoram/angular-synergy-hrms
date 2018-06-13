import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailEditDialogComponent } from './detail-edit-dialog.component';

describe('DetailEditDialogComponent', () => {
  let component: DetailEditDialogComponent;
  let fixture: ComponentFixture<DetailEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
