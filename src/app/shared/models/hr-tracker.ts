import { Tracker } from "./tracker";

export interface HrTracker {
  employeeId: string;
  employee: string;
  requestDate?: Date;
  state: number;
  creationFingerprint?: any;
  tracker?: Tracker;
}
