import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SynergyLogoComponent } from './synergy-logo.component';

describe('SynergyLogoComponent', () => {
  let component: SynergyLogoComponent;
  let fixture: ComponentFixture<SynergyLogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SynergyLogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SynergyLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
