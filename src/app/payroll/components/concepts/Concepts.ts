export class PayrollConcept {

    constructor(
            public type: string,
            public employeee: string,
            public employeeId: string,
            public reason: string,
            public date: Date,
            public submittedDate: Date,
            public amount: number,
            public creationFingerprint: string,
            public verified: boolean = false,
            public payed: boolean = false,
            public createdAt: Date,
            public createdBy: any,
        ) {
    }
}