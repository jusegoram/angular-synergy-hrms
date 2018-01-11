export class IEmployee {
  constructor(public id: string,
              public employeeId: string,
              public firstName: string,
              public lastName: string,
              public birthDate: Date,
              public socialSecurity: string,
              public client: string,
              public campaign: string,
              public positionid: number,
              public positionName: string,
              public status: string,
              public hireDate: Date,
              public terminationDate?: Date,
            ) { }
  }
