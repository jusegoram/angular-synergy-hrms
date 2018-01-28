export class EmployeePosition {
constructor(public id: string,
            public employeeId: string,
            public positionid: string,
            public position: string,
            public startDate: Date,
            public endDate: Date
            ) { }
}

export class EmployeePersonal {
constructor(public id: string,
            public employeeId: string,
            public address: string,
            public addressDate: string,
            public celNumber: string,
            public telNumber: string,
            public emailAdress: string,
            public emailDate: string
            ) { }
}

export class EmployeeFamily {
    constructor(public id: string,
                public employeeId: string,
                public referenceName: string,
                public relationship: string,
                public celNumber: string,
                public telNumber: string,
                public emailAdress: string,
                public address: string
                ) { }
    }

export class EmployeeEducation {
    constructor(public id: string,
                    public employeeId: string,
                    public institution: string,
                    public description: string,
                    public startDate: string,
                    public endDate: string
                    ) { }
        }