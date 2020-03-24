import { Tracker } from "./tracker";

export interface HrTracker {
  employeeId: string;
  employee: string;
  requestDate: string;
  state: number;
  creationFingerprint: string;
  tracker: Tracker;
}
