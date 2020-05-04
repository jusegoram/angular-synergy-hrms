import { Pipe, PipeTransform } from '@angular/core';
import { LEAVE_STATUS } from '@synergy/environments/enviroment.common';

@Pipe({
  name: 'leaveStatus',
  pure: true,
})
export class LeaveStatusPipe implements PipeTransform {
  transform(leaveStatusId: number, ...args: unknown[]): string {
    switch (leaveStatusId) {
      case LEAVE_STATUS.REFUSED:
        return 'REFUSED';
      case LEAVE_STATUS.SENT:
        return 'SUBMITTED';
      case LEAVE_STATUS.CERTIFIED:
        return 'CERTIFIED';
      case LEAVE_STATUS.SUPPORTED:
        return 'SUPPORTED';
      case LEAVE_STATUS.APPROVED:
        return 'APPROVED';
      case LEAVE_STATUS.FINISHED:
        return 'SENT';
      case LEAVE_STATUS.PROCESSED:
        return 'PROCESSED';
    }
  }
}
