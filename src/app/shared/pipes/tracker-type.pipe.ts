import { Pipe, PipeTransform } from '@angular/core';
import { Tracker } from '../models';

@Pipe({
  name: 'trackerType',
  pure: true,
})
export class TrackerTypePipe implements PipeTransform {
  transform(tracker: Tracker, ...args: unknown[]): string {
    if (tracker.statusChange) {
      return 'STATUS';
    }

    if (tracker.transfer) {
      return 'TRANSFER';
    }

    if (tracker.certifyTraining) {
      return 'CERTIFY';
    }

    if (tracker.infoChangeRequest) {
      return 'INFO CHANGE';
    }
  }
}
