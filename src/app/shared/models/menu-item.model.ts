export class BadgeItem {
  constructor(public type: string, public value: string) {}
}

export class ChildrenItems {
  constructor(public state: string, public name: string, public type?: string) {}
}

export class MenuItem {
  constructor(
    public state: any,
    public name: string,
    public type: string,
    public icon: string,
    public badge?: BadgeItem[],
    public children?: ChildrenItems[],
    public page?: number,
    public _id?: string,
    public position?: number
  ) {}
}
