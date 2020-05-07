import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { EmployeeService } from '@synergy-app/core/services/employee.service';
import { LeaveRequest } from '@synergy-app/shared/models/leave-request';
import { ColumnMode } from '@swimlane/ngx-datatable';
import Swal from 'sweetalert2';
import { LEAVE_STATUS } from '@synergy/environments/enviroment.common';
import moment from 'moment';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { PdfViewerComponent } from '@synergy-app/shared/modals/pdf-viewer/pdf-viewer.component';
import { Department } from '@synergy-app/shared/models/positions-models';
import { CreateDepartmentDialogComponent } from '@synergy-app/pages/dashboard/administration/employee/position/create-department-dialog/create-department-dialog.component';

@Component({
  selector: 'app-leaves',
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.css'],
})
export class LeavesComponent implements OnInit {
  @ViewChild('documentTemplate', { static: true }) documentTemplate: TemplateRef<any>;
  @ViewChild('payLeaveTemplate', { static: true }) payLeaveTemplate: TemplateRef<any>;

  data: Array<LeaveRequest> = [];
  columns: Array<any> = [];
  ColumnMode = ColumnMode;
  constructor(private _employeeService: EmployeeService, private datePipe: DatePipe, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.initTable();
    this.getLeaves();
  }
  initTable() {
    this.columns = [
      { name: 'EMPLOYEE ID', prop: 'employee.employeeId', width: 100 },
      { name: 'NAME', prop: 'employee.fullName', width: 200 },
      { name: 'LEAVE TYPE', prop: 'leaveType.name', width: 100 },
      { name: 'FROM', prop: 'excuseTimeFrom', width: 100, pipe: this.formatDate()},
      { name: 'TO', prop: 'excuseTimeTo', width: 100, pipe: this.formatDate()},
      { name: 'SUPPORT', prop: 'supportDocument', cellTemplate: this.documentTemplate, width: 100 },
      { name: 'CERTIFICATION', prop: 'certificationDocument', cellTemplate: this.documentTemplate, width: 100 },
      { name: 'MARK AS', prop: '_id', cellTemplate: this.payLeaveTemplate, width: 200 },
    ];
  }
  formatDate() {
    return {transform: (date) => this.datePipe.transform(date, 'MM/dd/yyyy')};
  }
  async getLeaves() {
    try {
      this.data = await this._employeeService.getLeaves({
        state: '4',
        excuseTimeFrom: moment().endOf('day').toISOString(),
      });
    } catch (e) {
      console.log(e);
    }
  }
  confirmConceptCreated(leaveId) {
    Swal.fire({
      title: 'ARE YOU SURE',
      text: 'Please make sure the concept is created before accepting',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'CONFIRM',
      cancelButtonText: 'CANCEL',
    }).then(async (result) => {
      if (result.value) {
        await this.markAsConceptCreated(leaveId);
      }
    });
  }
  async markAsConceptCreated(leaveId) {
    try {
      const leaveRequest: Partial<LeaveRequest> = {
        _id: leaveId,
        state: LEAVE_STATUS.PROCESSED,
      };
      await this._employeeService.updateLeave(leaveRequest);
      await this.getLeaves();
      await Swal.fire('Great!', 'The leave was processed successfully', 'success');
    } catch (error) {
      Swal.fire('Woa!', 'Error happened. Try again later.', 'error');
    }
  }
  openViewDocDialog(url) {
    const ref = this.dialog.open(PdfViewerComponent, {
      width: '500px',
      data: url,
    });
  }
}
