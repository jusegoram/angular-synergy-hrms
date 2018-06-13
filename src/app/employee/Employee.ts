export class Employee {
  constructor(public _id: string,
              public employeeId: number,
              public firstName: string,
              public lastName: string,
              public socialSecurity: string,
              public status: string,
              public gender: string,
              public middleName?: string,
              public company?: Object,
              public position?: Object,
              public payroll?: Object,
              public personal?: Object,
              public family?: Object,
              public education?: Object,
              public comments?: Object,
            ) { }
  }

// updated as of april 22 7:08 2018
export class EmployeePosition {
  constructor(public _id: string,
              public employeeId: string,
              public client: string,
              public department: string,
              public employee: string,
              public position: string,
              public startDate: Date,
              public endDate?: Date,
  ) { }
}


// updated as of april 22 7:08 2018
export class EmployeeCompany {
  constructor(public _id: string,
              public employeeId: string,
              public employee: string,
              public client: string,
              public campaign: string,
              public supervisor: string,
              public trainer: string,
              public trainingGroupRef: string,
              public trainingGroupNum: number,
              public hireDate: Date,
              public terminationDate: Date,
              public reapplicant: boolean,
              public reapplicantTimes: number,
  ) {
  }
}

// updated as of april 22 7:08 2018
export class EmployeePersonal {
  constructor(public _id: string,
              public employeeId: string,
              public employee: string,
              public maritalStatus: string,
              public address: string,
              public town: string,
              public district: string,
              public addressDate: string,
              public celNumber: string,
              public telNumber: string,
              public birthDate: Date,
              public birthPlaceDis: string,
              public birthPlaceTow: string,
              public emailAddress: string,
              public emailDate: string
  ) { }
}
// updated as of april 22 7:08 2018
export class EmployeeFamily {
  constructor(public _id: string,
              public employeeId: string,
              public employee: string,
              public referenceName: string,
              public relationship: string,
              public celNumber: string,
              public telNumber: string,
              public emailAdress: string,
              public address: string
  ) { }
}
// updated as of april 22 7:08 2018
export class EmployeePayroll {
  constructor(public _id: string,
              public employeeId: string,
              public employee: string,
              public TIN: string,
              public positionid: string,
              public payrollType: string,
              public bankName: string,
              public bankAccount: string,
              public billable: boolean,
  ) { }
}

// updated as of april 22 7:08 2018
export class EmployeeEducation {
  constructor(public _id: string,
              public employeeId: string,
              public employee: string,
              public institution: string,
              public description: string,
              public startDate: string,
              public endDate: string
  ) { }


}
