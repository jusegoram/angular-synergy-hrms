import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { EmployeeService } from '@synergy-app/shared/services/employee.service';
import { LeavesComponent } from './leaves.component';
import { LeaveStatusPipe } from '@synergy-app/shared/pipes/leave-status.pipe';
import { SessionService } from '@synergy-app/shared/services/session.service';

class SessionServiceMockup {
  decodeToken() {
    return {
      userId: '',
      name: '',
      role: 0,
    };
  }
}

describe('LeavesComponent', () => {
  let component: LeavesComponent;
  let fixture: ComponentFixture<LeavesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LeavesComponent],
      imports: [MatDialogModule, HttpClientTestingModule],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        LeaveStatusPipe,
        { provide: EmployeeService, useValue: {} },
        { provide: SessionService, useClass: SessionServiceMockup },
      ],
    }).compileComponents();
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
