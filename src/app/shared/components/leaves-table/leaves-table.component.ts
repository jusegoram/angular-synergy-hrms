import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { LeaveRequest, User } from '@synergy-app/shared/models';
import { LEAVE_STATUS_TYPES } from '@synergy/environments';

@Component({
  selector: 'app-leaves-table',
  templateUrl: './leaves-table.component.html',
  styleUrls: ['./leaves-table.component.scss'],
})
export class LeavesTableComponent implements OnInit {
  @Input() isLoading = true;
  @Input() leaves: Array<LeaveRequest> = [];
  @Input() user: User;
  @Input() userIsWebAdmin = false;
  @Input() isHrSubPage: boolean;
  @Output() onEditButtonClicked = new EventEmitter<LeaveRequest>();
  @Output() onDeleteButtonClicked = new EventEmitter<LeaveRequest>();
  @Output() onApproveButtonClicked = new EventEmitter<LeaveRequest>();
  @Output() onSendFinanceButtonClicked = new EventEmitter<LeaveRequest>();
  @Output() onSupportButtonClicked = new EventEmitter<{ file: File; leaveRequest: LeaveRequest }>();
  @Output() onCertifyButtonClicked = new EventEmitter<{ file: File; leaveRequest: LeaveRequest }>();

  @ViewChild('trackerInboxTable', { static: false }) trackerInboxTable: any;
  leaveStatusTypes = new Map(Object.entries(LEAVE_STATUS_TYPES));

  constructor() {}

  ngOnInit(): void {}

  toggleExpandRow(row) {
    this.trackerInboxTable.rowDetail.toggleExpandRow(row);
  }
}
