import { Component, OnInit, Input } from '@angular/core';
import { LeaveRequest } from '@synergy-app/shared/models';

@Component({
  selector: 'app-leave-row-details',
  templateUrl: './leave-row-details.component.html',
  styleUrls: ['./leave-row-details.component.scss']
})
export class LeaveRowDetailsComponent implements OnInit {
  @Input() leaveRequest: LeaveRequest;

  constructor() { }

  ngOnInit(): void {
  }

}
