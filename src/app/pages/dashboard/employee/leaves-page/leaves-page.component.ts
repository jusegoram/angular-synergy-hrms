import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { TIME_VALUES, LEAVE_STATUS, USER_ROLES } from '@synergy/environments';
import { MatDialog } from '@angular/material/dialog';
import { GenerateLeaveModalComponent } from '@synergy-app/shared/modals';
import { EmployeeService, SessionService } from '@synergy-app/core/services';
import { OnErrorAlertComponent } from '@synergy-app/shared/modals/on-error-alert/on-error-alert.component';
import Swal from 'sweetalert2';
import { User, LeaveRequest } from '@synergy-app/shared/models';

@Component({
  selector: 'app-leaves',
  templateUrl: './leaves-page.component.html',
  styleUrls: ['./leaves-page.component.scss'],
})
export class LeavesPageComponent implements OnInit, AfterViewInit {
  @ViewChild('onErrorAlert', { static: false }) onErrorAlert: OnErrorAlertComponent;
  @ViewChild('trackerInboxTable', { static: false }) trackerInboxTable: any;
  @ViewChild('inputFilter', { static: false }) inputFilter: any;
  data: Array<LeaveRequest> = [];
  isLoading = true;
  filter = '';
  leaveStatusTypes = LEAVE_STATUS;
  currentUserIsWebAdmin = false;
  currentLoggedUser: User;
  constructor(
    public dialog: MatDialog,
    private employeeService: EmployeeService,
    private sessionService: SessionService
  ) {}

  ngOnInit() {
    this.setCurrentLoggedUser();
    this.checkIfCurrentUserIsWebAdmin();
    this.fetchLeavesRequest();
  }

  ngAfterViewInit() {
    this.setUpInputFilter();
  }

  setCurrentLoggedUser() {
    const { userId, name, role } = this.sessionService.decodeToken();
    this.currentLoggedUser = new User('');
    this.currentLoggedUser._id = userId;
    this.currentLoggedUser.firstName = name;
    this.currentLoggedUser.role = role;
  }

  checkIfCurrentUserIsWebAdmin() {
    const { role } = this.sessionService.decodeToken();
    this.currentUserIsWebAdmin = role === USER_ROLES.WEB_ADMINISTRATOR.value;
  }

  async fetchLeavesRequest() {
    this.isLoading = true;
    try {
      this.data = await this.employeeService.getLeaves({
        owner_id: this.currentLoggedUser._id
      });
      this.isLoading = false;
    } catch (error) {}
  }

  setUpInputFilter() {
    fromEvent(this.inputFilter.nativeElement, 'keydown')
      .pipe(
        debounceTime(TIME_VALUES.SHORT_DEBOUNCE_TIME),
        map((event: any) => event.target.value)
      )
      .subscribe((value) => {
        this.filter = value.trim();
      });
  }

  get filteredData(): Array<LeaveRequest> {
    if (this.filter && this.data) {
      const filterNormalized = this.filter.toLowerCase();
      return this.data.filter((item: LeaveRequest) => {
        return (
          item.employee?.employeeId.includes(filterNormalized) ||
          item.employee?.fullName.toLowerCase().includes(filterNormalized) ||
          item.leaveType?.name.toLowerCase().includes(filterNormalized)
        );
      });
    }
    return this.data;
  }

  toggleExpandRow(row) {
    this.trackerInboxTable.rowDetail.toggleExpandRow(row);
  }

  openGenerateLeaveDialog(mode: string, leaveRequest?: LeaveRequest) {
    const dialogRef = this.dialog.open(GenerateLeaveModalComponent, {
      width: '600px',
      data: { mode, leaveRequest, isHRMode: false },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.state) {
        this.fetchLeavesRequest();
        Swal.fire('Done!', 'The changes were saved correctly', 'success');
      } else {
        this.onErrorAlert.fire();
      }
    });
  }

  openApproveDialog(leave: LeaveRequest) {
    Swal.fire({
      title: 'ARE YOU SURE',
      text: 'Do you really want to approve the this leave request?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'YES',
      cancelButtonText: 'NO',
    }).then(async (result) => {
      if (result.value) {
        try {
          const leaveRequest: Partial<LeaveRequest> = {
            _id: leave._id,
            state: LEAVE_STATUS.APPROVED,
          };
          if (['Vacations', 'Leave without pay'].includes(leave.leaveType.name)) {
            leaveRequest.state = LEAVE_STATUS.CERTIFIED;
          }
          await this.employeeService.updateLeave(leaveRequest);
          await this.fetchLeavesRequest();
        } catch (error) {
          Swal.fire('Done!', 'Error happened. Try again later.', 'error');
        }
      }
    });
  }

  openDeleteDialog(leave: LeaveRequest) {
    Swal.fire({
      title: 'ARE YOU SURE',
      text: 'You can\'t undo a deletion',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'YES',
      cancelButtonText: 'NO',
    }).then(async (result) => {
      if (result.value) {
        try {
          await this.employeeService.deleteLeave(leave._id);
          await this.fetchLeavesRequest();
        } catch (error) {
          Swal.fire('Done!', 'Error happened. Try again later.', 'error');
        }
      }
    });
  }
}
