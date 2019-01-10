import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloudUploadComponent } from './cloud-upload.component';

describe('CloudUploadComponent', () => {
  let component: CloudUploadComponent;
  let fixture: ComponentFixture<CloudUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloudUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloudUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
