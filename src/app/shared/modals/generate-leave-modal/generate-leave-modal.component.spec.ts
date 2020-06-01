import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GenerateLeaveModalComponent } from './generate-leave-modal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeeService, SessionService, AdminService } from '@synergy-app/core/services';
import { FormBuilder } from '@angular/forms';
import { MaterialSharedModule } from '@synergy-app/shared/material.shared.module';
import { of } from 'rxjs';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';

class AdminServiceMock {
  getEmployees() {
    return of([]);
  }
}

describe('GenerateLeaveModalComponent', () => {
  let component: GenerateLeaveModalComponent;
  let fixture: ComponentFixture<GenerateLeaveModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GenerateLeaveModalComponent],
      imports: [MaterialSharedModule, HttpClientTestingModule, BrowserAnimationsModule, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: EmployeeService, useValue: {} },
        { provide: AdminService, useClass: AdminServiceMock },
        { provide: SessionService, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        FormBuilder,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateLeaveModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
