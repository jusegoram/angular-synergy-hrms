import { Tracker } from './tracker.model';

export interface HrTracker {
  _id?: string;
  employeeId: string;
  employee: {
    _id: string;
    fullName: string;
  };
  requestDate?: Date;
  requestDateFormatted?: string;
  deadlineDateFormatted?: string;
  state: number;
  stateName?: string;
  creationFingerprint?: any;
  tracker?: Tracker;
  trackerTypeName?: string;
  verificationFingerprint?: string;
}
