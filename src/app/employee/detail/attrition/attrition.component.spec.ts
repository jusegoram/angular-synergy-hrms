import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttritionComponent } from './attrition.component';

describe('AttritionComponent', () => {
  let component: AttritionComponent;
  let fixture: ComponentFixture<AttritionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttritionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttritionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
