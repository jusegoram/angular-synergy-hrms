import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeniedAccessComponent } from './denied-access.component';

describe('DeniedAccessComponent', () => {
  let component: DeniedAccessComponent;
  let fixture: ComponentFixture<DeniedAccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeniedAccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeniedAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
