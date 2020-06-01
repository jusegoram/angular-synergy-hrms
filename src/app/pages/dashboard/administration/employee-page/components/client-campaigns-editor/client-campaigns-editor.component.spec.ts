import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientCampaignsEditorComponent } from './client-campaigns-editor.component';

xdescribe('ClientCampaignsEditorComponent', () => {
  let component: ClientCampaignsEditorComponent;
  let fixture: ComponentFixture<ClientCampaignsEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientCampaignsEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientCampaignsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
