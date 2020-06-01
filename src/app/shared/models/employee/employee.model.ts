export interface Employee {
  _id?: string;
  onFinalPayment?: boolean;
  onLeave?: boolean;
  leaveType?: string;
  employeeId?: number;
  restriction?: string;
  fullName?: string;
  fullSearchName?: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  socialSecurity: string;
  status: string;
  company?: EmployeeCompany;
  personal?: EmployeePersonal;
  payroll?: EmployeePayroll;
  comments?: EmployeeComment[];
  attrition?: EmployeeAttrition[];
  family?: EmployeeFamily[];
  education?: EmployeeEducation[];
  position?: EmployeePosition[];
  updatedAt?: Date;
  createdAt?: Date;
  createdBy?: any;
  updatedBy?: any;
}

export interface Hobby {
  _id?: string;
  hobbyTitle: string;
  hobbyComment: string;
  updatedAt?: Date;
  createdAt?: Date;
  createdBy?: any;
  updatedBy?: any;
}

export interface EmployeePersonal {
  _id?: string;
  employee: string;
  maritalStatus: string;
  amountOfChildren: number;
  address: string;
  town: string;
  district: string;
  addressDate: Date;
  celNumber: string;
  telNumber: string;
  birthDate: Date;
  birthPlaceDis: string;
  birthPlaceTow: string;
  emailAddress: string;
  emailDate: Date;
  hobbies: Hobby[];
  updatedAt?: Date;
  createdAt?: Date;
  createdBy?: any;
  updatedBy?: any;
}

export interface Manager {
  _id?: string;
  manager_id: string;
  name: string;
  date?: Date;
}

export interface EmployeeCompany {
  _id?: string;
  employee: string;
  client: string;
  campaign: string;
  manager: Manager;
  shiftManager: Manager;
  supervisor: Manager;
  trainer: Manager;
  branch: string;
  trainingGroupRef: string;
  trainingGroupNum: number;
  hireDate: Date;
  terminationDate: Date;
  reapplicant: boolean;
  reapplicantTimes: number;
  bilingual: boolean;
  updatedAt?: Date;
  createdAt?: Date;
  createdBy?: any;
  updatedBy?: any;
}

export interface EmployeePayroll {
  _id?: string;
  employee: string;
  TIN: string;
  payrollType: string;
  bankName: string;
  bankAccount: string;
  billable: boolean;
  paymentType: string;
  updatedAt?: Date;
  createdAt?: Date;
  updatedBy?: any;
  createdBy?: any;
}

export interface EmployeeComment {
  _id?: string;
  employee: string;
  reason?: string;
  comment: string;
  commentDate: Date;
  submittedBy: any;
  updatedAt?: Date;
  createdAt?: Date;
  createdBy?: any;
  updatedBy?: any;
}

export interface EmployeeAttrition {
  _id?: string;
  employee: string;
  reason1: string;
  reason2: string;
  comment: string;
  commentDate: Date;
  submittedBy: any;
  updatedAt?: Date;
  createdAt?: Date;
  createdBy?: any;
  updatedBy?: any;
}

export interface EmployeeEmergency {
  _id?: string;
  employee: string;
  // TODO: finish the interface
}

export interface EmployeeEducation {
  _id?: string;
  employee: string;
  institution: string;
  levelOfEducation: string;
  numberOfYears: string;
  mayor: string;
  description: string;
  startDate: Date;
  endDate: Date;
  updatedAt?: Date;
  createdAt?: Date;
  createdBy?: any;
  updatedBy?: any;
}

export interface EmployeePosition {
  _id?: string;
  employee: string;
  client: string;
  department: string;
  positionId: string;
  name: string;
  baseWage: number;
  startDate: Date;
  endDate: Date;
  updatedAt?: Date;
  createdAt?: Date;
  updatedBy?: any;
  createdBy?: any;
}

export interface EmployeeFamily {
  _id?: string;
  employee: string;
  referenceName: string;
  relationship: string;
  birthDate: Date;
  celNumber: string;
  telNumber: string;
  emailAddress: string;
  address: string;
  emergencyContact: boolean;
  comment: string;
  updatedAt?: Date;
  createdAt?: Date;
  createdBy?: any;
  updatedBy?: any;
}

export class Position {
  public startDate: Date;
  public position: any;

  constructor() {
    this.startDate = null;
    this.position = {
      name: '',
      positionId: '',
    };
  }
}
