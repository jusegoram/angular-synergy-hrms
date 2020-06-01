export interface UserFingerprint {
  _id: string;
  name: string;
  role: number;
}

export interface LeaveType {
  isCashVacations: boolean;
  name: string;
}

export interface LeaveRequest {
  employee: {
    _id: string;
    employeeId: string;
    fullName: string;
  };
  creationFingerprint: UserFingerprint;
  verificationFingerprint: UserFingerprint;
  state: number;
  _id: string;
  leaveType: LeaveType;
  supportDocument: string;
  certificationDocument: string;
  createdAt: Date;
  updatedAt: Date;
  excuseDescription: string;
  excuseTimeFrom: Date;
  excuseTimeTo: Date;
}
