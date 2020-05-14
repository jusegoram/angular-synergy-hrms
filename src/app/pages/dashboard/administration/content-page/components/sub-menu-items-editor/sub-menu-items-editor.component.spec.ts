import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SubMenuItemsEditorComponent } from './sub-menu-items-editor.component';

xdescribe('SubMenuItemsEditorComponent', () => {
  let component: SubMenuItemsEditorComponent;
  let fixture: ComponentFixture<SubMenuItemsEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubMenuItemsEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubMenuItemsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
