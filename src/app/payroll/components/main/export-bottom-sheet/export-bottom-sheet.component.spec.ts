import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportBottomSheetComponent } from './export-bottom-sheet.component';

describe('ExportBottomSheetComponent', () => {
  let component: ExportBottomSheetComponent;
  let fixture: ComponentFixture<ExportBottomSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportBottomSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
