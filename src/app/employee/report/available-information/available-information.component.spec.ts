import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableInformationComponent } from './available-information.component';

describe('AvailableInformationComponent', () => {
  let component: AvailableInformationComponent;
  let fixture: ComponentFixture<AvailableInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvailableInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
