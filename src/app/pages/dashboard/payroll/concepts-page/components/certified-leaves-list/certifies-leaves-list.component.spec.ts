import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CertifiedLeavesListComponent } from './certified-leaves-list.component';

xdescribe('LeavesComponent', () => {
  let component: CertifiedLeavesListComponent;
  let fixture: ComponentFixture<CertifiedLeavesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertifiedLeavesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertifiedLeavesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
