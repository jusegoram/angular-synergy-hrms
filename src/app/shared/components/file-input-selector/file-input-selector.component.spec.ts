import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileInputSelectorComponent } from './file-input-selector.component';

describe('FileInputSelectorComponent', () => {
  let component: FileInputSelectorComponent;
  let fixture: ComponentFixture<FileInputSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileInputSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileInputSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
