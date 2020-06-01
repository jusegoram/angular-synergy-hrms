import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { EmployeeService, SessionService } from '@synergy-app/core/services';
import { LeavesPageComponent } from './leaves-page.component';
import { LeaveStatusPipe } from '@synergy-app/shared/pipes/leave-status.pipe';

class SessionServiceMockup {
  decodeToken() {
    return {
      userId: '',
      name: '',
      role: 0,
    };
  }
}

describe('LeavesPageComponent', () => {
  let component: LeavesPageComponent;
  let fixture: ComponentFixture<LeavesPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LeavesPageComponent],
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
    fixture = TestBed.createComponent(LeavesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
