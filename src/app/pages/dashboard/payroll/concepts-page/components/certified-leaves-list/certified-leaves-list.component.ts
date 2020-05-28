import { Component, OnInit, TemplateRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { LeaveRequest } from '@synergy-app/shared/models';
import { ColumnMode } from '@swimlane/ngx-datatable';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { PdfViewerComponent } from '@synergy-app/shared/modals';

@Component({
  selector: 'app-certified-leaves-list',
  templateUrl: './certified-leaves-list.component.html',
  styleUrls: ['./certified-leaves-list.component.css'],
})
export class CertifiedLeavesListComponent implements OnInit {
  @ViewChild('documentTemplate', { static: true }) documentTemplate: TemplateRef<any>;
  @ViewChild('payLeaveTemplate', { static: true }) payLeaveTemplate: TemplateRef<any>;
  @Input() leaves: Array<LeaveRequest> = [];
  @Output() onMarkAsConceptCreatedConfirmation = new EventEmitter<string>();

  columns: Array<any> = [];
  ColumnMode = ColumnMode;
  constructor(private datePipe: DatePipe, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.initTable();
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

  confirmConceptCreated(leaveId) {
    Swal.fire({
      title: 'ARE YOU SURE',
      text: 'Please make sure the concept is created before accepting',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'CONFIRM',
      cancelButtonText: 'CANCEL',
    }).then( (result) => {
      if (result.value) {
        this.onMarkAsConceptCreatedConfirmation.emit(leaveId);
      }
    });
  }

  openViewDocDialog(url) {
    const ref = this.dialog.open(PdfViewerComponent, {
      width: '500px',
      data: url,
    });
  }
}
