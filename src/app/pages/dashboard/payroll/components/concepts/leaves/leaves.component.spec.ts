import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavesComponent } from './leaves.component';

xdescribe('LeavesComponent', () => {
  let component: LeavesComponent;
  let fixture: ComponentFixture<LeavesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeavesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeavesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
