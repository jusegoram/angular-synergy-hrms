import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { LeaveRequest } from '@synergy-app/shared/models/leave-request';
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { TIME_VALUES, LEAVE_STATUS } from '@synergy/environments/enviroment.common';
import { MatDialog } from '@angular/material/dialog';
import { GenerateLeaveModalComponent } from './components/generate-leave-modal/generate-leave-modal.component';
import { EmployeeService } from '@synergy-app/shared/services/employee.service';
import { OnErrorAlertComponent } from '@synergy-app/shared/modals/on-error-alert/on-error-alert.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-leaves',
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.scss'],
})
export class LeavesComponent implements OnInit, AfterViewInit {
  @ViewChild('onErrorAlert', { static: false }) onErrorAlert: OnErrorAlertComponent;
  @ViewChild('trackerInboxTable', { static: false }) trackerInboxTable: any;
  @ViewChild('inputFilter', { static: false }) inputFilter: any;
  data: Array<LeaveRequest> = [];
  isLoading = true;
  filter = '';

  constructor(public dialog: MatDialog, private employeeService: EmployeeService) {}

  ngOnInit() {
    this.fetchLeavesRequest();
  }

  ngAfterViewInit() {
    this.setUpInputFilter();
  }

  async fetchLeavesRequest() {
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

  openGenerateLeaveDialog(mode: string, leaveRequest: LeaveRequest) {
    const dialogRef = this.dialog.open(GenerateLeaveModalComponent, {
      width: '600px',
      data: { mode, leaveRequest, isHRMode: false },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.state) {
        Swal.fire('Done!', 'The changes were saved correctly', 'success').then(() => {
          location.reload();
        });
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
          await this.employeeService.updateLeave(leaveRequest);
          location.reload();
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
          location.reload();
        } catch (error) {
          Swal.fire('Done!', 'Error happened. Try again later.', 'error');
        }
      }
    });
  }
}
