export class IUser {
    constructor(public username: string,
                public password?: string,
                public role?: number,
                public firstName?: string,
                public lastName?: string) {}
}
