import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LeavesPageComponent } from './leaves-page.component';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { TrackerStatusPipe } from '@synergy-app/shared/pipes/tracker-status.pipe';
import { EmployeeService, SessionService } from '@synergy-app/core/services';

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
  let component: LeavesPageComponent;
  let fixture: ComponentFixture<LeavesPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LeavesPageComponent],
      imports: [MatDialogModule, HttpClientTestingModule],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        TrackerStatusPipe,
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
