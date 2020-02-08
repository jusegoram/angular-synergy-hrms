export class PayrollConcept {

    constructor(
            public type: string,
            public employee: string,
            public employeeName: string,
            public employeeId: string,
            public reason: string,
            public date: Date,
            public submittedDate: Date,
            public amount: number,
            public creationFingerprint: string,
            public verificationFingerprint: string,
            public verified: boolean = false,
            public payed: boolean = false,
            public createdAt: Date,
            public createdBy: any,
            public maternity?: boolean,
            public csl?: boolean,
            public from?: Date,
            public to?: Date,
            public totalDays?: number,
            public diagnosis?: string,
            public institution?: string,
            public doctorName?: string,
            public isPartiallyPayed?: boolean,
            public partialPayment?: number,
            public outstandingAmount?: number,
        ) {
    }
}