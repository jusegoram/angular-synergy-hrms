import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { LEAVE_STATUS, TIME_VALUES, LEAVE_STATUS_TYPES, USER_ROLES } from '@synergy/environments/enviroment.common';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeService, SessionService } from '@synergy-app/core/services';
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { GenerateLeaveModalComponent } from '@synergy-app/shared/modals';
import Swal from 'sweetalert2';
import { User, LeaveRequest } from '@synergy-app/shared/models';

@Component({
  selector: 'app-leaves',
  templateUrl: './leaves-page.component.html',
  styleUrls: ['./leaves-page.component.scss'],
})
export class LeavesPageComponent implements OnInit, AfterViewInit {
  @ViewChild('trackerInboxTable', { static: false }) trackerInboxTable: any;
  @ViewChild('inputFilter', { static: false }) inputFilter: any;
  data: Array<LeaveRequest> = [];
  isLoading = true;
  filter = '';
  APPROVED = LEAVE_STATUS.APPROVED;
  FINISHED = LEAVE_STATUS.FINISHED;
  leaveStatusTypes = new Map(Object.entries(LEAVE_STATUS_TYPES));
  selectedLeaveStatusType = -2;
  currentLoggedUser: User;
  currentUserIsWebAdmin = false;
  constructor(
    public dialog: MatDialog,
    private employeeService: EmployeeService,
    private sessionService: SessionService
  ) {}

  ngOnInit() {
    this.setCurrentLoggedUser();
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
    this.currentUserIsWebAdmin = role === USER_ROLES.WEB_ADMINISTRATOR.value;
  }

  async fetchLeavesRequest() {
    this.isLoading = true;
    try {
      this.data = await this.employeeService.getLeaves();
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
    if ((this.selectedLeaveStatusType > -2 || this.filter) && this.data) {
      const filterNormalized = this.filter.toLowerCase();
      return this.data.filter((item: LeaveRequest) => {
        return (
          (this.selectedLeaveStatusType > -2 ? item.state === this.selectedLeaveStatusType : true) &&
          (item.employee?.employeeId.includes(filterNormalized) ||
            item.employee?.fullName.toLowerCase().includes(filterNormalized) ||
            item.leaveType?.name.toLowerCase().includes(filterNormalized))
        );
      });
    }
    return this.data;
  }

  toggleExpandRow(row) {
    this.trackerInboxTable.rowDetail.toggleExpandRow(row);
  }

  showErrorMessage() {
    Swal.fire(
      'ERROR',
      'We could not save the changes made, please verify that the data was filled in correctly and try again',
      'error'
    );
  }

  openGenerateLeaveDialog(mode: string, leaveRequest?: LeaveRequest) {
    const dialogRef = this.dialog.open(GenerateLeaveModalComponent, {
      width: '600px',
      data: { mode, leaveRequest, isHRMode: true },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.state) {
        this.fetchLeavesRequest();
        Swal.fire('Done!', 'The changes were saved correctly', 'success');
      } else {
        this.showErrorMessage();
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

  openFinishDialog(leave: LeaveRequest) {
    Swal.fire({
      title: 'ARE YOU SURE',
      text: 'Do you really want to finish this leave request?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'YES',
      cancelButtonText: 'NO',
    }).then(async (result) => {
      if (result.value) {
        try {
          const leaveRequest: Partial<LeaveRequest> = {
            _id: leave._id,
            state: LEAVE_STATUS.FINISHED,
            verificationFingerprint: {
              _id: this.currentLoggedUser._id,
              name: this.currentLoggedUser.firstName,
              role: this.currentLoggedUser.role,
            },
          };
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

  openUploadDocumentDialog(file: File, leaveStatus: string, leaveRequestId: string) {
    Swal.fire({
      title: 'ARE YOU SURE',
      text: 'You want to upload ' + file.name + ' file?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'YES',
      cancelButtonText: 'NO',
    }).then(async (result) => {
      if (result.value) {
        try {
          const leaveRequest: Partial<LeaveRequest> = {
            _id: leaveRequestId,
            state: this.leaveStatusTypes.get(leaveStatus).id,
          };
          const documentType = leaveStatus === 'SUPPORTED' ? 'supportDocument' : 'certifyDocument';
          await this.employeeService.updateLeaveWithDocument(file, leaveRequest, documentType);
          await this.fetchLeavesRequest();
        } catch (error) {
          Swal.fire('Done!', 'Error happened. Try again later.', 'error');
        }
      }
    });
  }
}
