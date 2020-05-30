import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnFinalpaymentComponent } from './on-finalpayment.component';

xdescribe('OnFinalpaymentComponent', () => {
  let component: OnFinalpaymentComponent;
  let fixture: ComponentFixture<OnFinalpaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnFinalpaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnFinalpaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
