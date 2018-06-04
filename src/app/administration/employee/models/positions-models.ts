export class Client {
    constructor(
        public state: string,
        public id: string,
        public name: string,
        public campaigns: Campaign[]) { }
        } 

export class Campaign {
    constructor(
        public id: string,
        public name: string) { }
        }

export class Department {
    constructor (   public state: string, 
                    public id: string,
                    public name: string,
                    public positions: Position[] ) { }
}   

export class Position {
    constructor( 
        public id: string,
        public positionid: string,
        public name: string,
        public baseWage: number,) { }
}

   
