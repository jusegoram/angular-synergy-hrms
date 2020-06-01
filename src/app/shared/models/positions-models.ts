export class Client {
  constructor(
    public state: string,
    public _id: string,
    public name: string,
    public campaigns: Campaign[]
  ) {}
}

export class Campaign {
  constructor(public _id?: string, public name?: string) {}
}

export class Department {
  constructor(
    public state: string,
    public _id: string,
    public name: string,
    public positions: Position[]
  ) {}
}
export class Position {
  constructor(
    public _id: string,
    public positionId: string,
    public name: string,
    public baseWage: number
  ) {}
}

export class Workpattern {
  constructor(
    public state: string,
    public _id: string,
    public name: string,
    public shift: Day[]
  ) {}
}

export class Day {
  constructor(
    public day: number,
    public onShift: boolean,
    public startTime: any,
    public endTime: any
  ) {}
}
