export class User {
    constructor(public username: string,
                public password?: string,
                public role?: number,
                public firstName?: string,
                public middleName?: string,
                public lastName?: string,
                public creationDate?: Date,
                public employeeId?: string,
                public log?: string) {}
}
