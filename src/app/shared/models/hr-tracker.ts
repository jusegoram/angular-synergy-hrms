import { Tracker } from "./tracker";

export interface HrTracker {
  _id?: string;
  employeeId: string;
  employee: {
    _id: string;
    fullName: string;
  };
  requestDate?: Date;
  state: number;
  creationFingerprint?: any;
  tracker?: Tracker;
}
