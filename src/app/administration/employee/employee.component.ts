import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Department, Position, Client, Campaign, Workpattern, Day } from './models/positions-models';
import { AdminService } from '../services/admin.services';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
/**
 * @property {Client[]} clients all clients on list
 * @property {Department[]} departments all departments on list
 * @property {any[]} wp all workpatterns on list
 * @memberof EmployeeComponent
 */
  public departments: Department[];
  public clients: Client[];
  public wp: Workpattern[];

  public currentDep: Department;
  public currentCli: Client;
  public currentWp: Workpattern;

  public newDep: string;
  public newCli: string;
  public newWp: string;

  public newShift: Day[];
  public newPos: Position;
  public newCam: Campaign;
  public defaultWp: Workpattern;

  selectedDep = 'New';
  selectedWp = 'New';
  selectedCli = 'New';

  refreshShiftBut = false;
  panelState = false;



  constructor(private _admService: AdminService, private snackBar: MatSnackBar) {
    this.newPos = new Position('', '', '', null);
    this.newCam = new Campaign('', '');
    this.defaultWp = {
    state: 'default',
    _id: '',
    name: 'New',
    shift: [
      new Day(0, false, null, null), new Day(1, false, null, null),
      new Day(2, false, null, null), new Day(3, false, null, null),
      new Day(4, false, null, null), new Day(5, false, null, null),
      new Day(6, false, null, null)]
    };
    this.currentWp = this.defaultWp;
   }

  ngOnInit() {
    this.departments = [
      { state: 'default',
        _id: '',
        name: 'New',
        positions: []
      }
    ];

    this.clients = [
      { state: 'default',
        _id: '',
        name: 'New',
        campaigns: []
      }
    ];

    this.wp = [
    ];
    this.getSelectedWp();
    this._admService.getDepartment().subscribe((results: Department[]) => {
      results.forEach(result => {
        this.departments.push(result);
      });
    });

    this._admService.getClient().subscribe((results: Client[]) => {
      results.forEach(result => {
        this.clients.push(result);
      });
    });

    this._admService.getShift().subscribe((results: Workpattern[]) => {
      results.forEach(result => {
        result.shift.forEach(day => {
          if ( day.endTime !== null && day.startTime !== null) {
            const storedEnd = parseInt(day.endTime, 10);
            const storedStart = parseInt(day.startTime, 10);

            const hoursEnd = Math.floor(storedEnd / 60);
            const minutesEnd = storedEnd - ( hoursEnd * 60 );

            const hoursStart = Math.floor(storedStart / 60);
            const minutesStart = storedStart - ( hoursStart * 60 );

            day.endTime = hoursEnd + ':' + minutesEnd;
            day.startTime = hoursStart + ':' + minutesStart;
          }
        });
        this.wp.push(result);
      });
    });
  }

  getSelectedDep(): Department {
    let found: Department;
    const name = this.selectedDep;
    found = this.departments.find(result => {
      return result.name === name;
    });
    this.currentDep = found;
    this.newDep = this.currentDep.name;
    return found;
  }

  getSelectedCli(): Client {
    let found: Client;
    const name = this.selectedCli;
    found = this.clients.find(result => {
      return result.name === name;
    });
    console.log(found);
    this.currentCli = found;
    this.newCli = this.currentCli.name;
    return found;
  }

  getSelectedWp(): Workpattern {
    let found: Workpattern;
    const name = this.selectedWp;
    if (this.wp) {
    found = this.wp.find(result => {
      return result.name === name;
    });
  } else {
    found = this.defaultWp;
  }
    return found;
  }

  onAddDep() {

    const i = this.departments.findIndex(result => {
      return result.name === this.newDep;
    });
    if (i >= 0) {
    this.currentDep.positions.push(this.newPos);
      if (this.departments[i]._id !== '') {
        this.departments[i].state = 'newPosition';
      } else {
        this.departments[i].state = 'new';
      }

      this.departments[i].positions = this.currentDep.positions;

    console.log(this.departments);
    this.newPos = new Position('', '', '', null);
    }else {
      const submitted = new Department('new', '', this.newDep, []);
      submitted.positions.push(this.newPos);
      this.departments.push(submitted);
      this.newPos = new Position('', '', '', null);
    }
  }

  onAddCli() {

    const i = this.clients.findIndex(result => {
      return result.name === this.newCli;
    });
    if (i >= 0) {
    this.currentCli.campaigns.push(this.newCam);
    if (this.clients[i]._id !== '') {
      this.clients[i].state = 'newPosition';
    } else {
      this.clients[i].state = 'new';
    }
    this.clients[i].campaigns = this.currentCli.campaigns;
    this.newCam = new Campaign('', '');
    } else {
      const submitted = new Client('new', '', this.newCli, []);
      submitted.campaigns.push(this.newCam);
      this.clients.push(submitted);
      console.log(this.departments);
      this.newCam = new Campaign('', '');
    }
  }

  onChangesDep() {
    const i = this.departments.findIndex(result => {
      return result.name === this.newDep;
    });
    if (this.departments[i]._id === '') {
      this.departments[i].state = 'new';
    } else if ( this.departments[i].state !== 'modified' ) {
      this.departments[i].state = 'modified';
    }

  }

  onChangesCli() {
    const i = this.clients.findIndex(result => {
      return result.name === this.newCli;
    });
    if (this.clients[i]._id === '') {
      this.clients[i].state = 'new';
    } else if ( this.clients[i].state !== 'modified' ) {
      this.clients[i].state = 'modified';
    }

  }

  onSaveDep() {
    for (let i = 0; i < this.departments.length; i++ ) {
      if (this.departments[i].state === 'new') {
        // save admService
        this._admService.saveDepartment(this.departments[i])
        .subscribe(result => {
          this.departments[i].state = 'saved';
        });
      }else if (this.departments[i].state === 'newPosition') {
        this._admService.savePosition(this.departments[i]).subscribe(
          data => {
            this.snackBar.open('Position information updated successfully', 'thank you', {
              duration: 2000,
            });
            this.departments[i].state = 'saved';
          },
          error => {
            this.snackBar.open('Error updating information, please try again or notify the IT department', 'Try again', {
              duration: 2000,
            });
          }
        );
      }else if (this.departments[i].state === 'modified') {
        this._admService.updateDepartment(this.departments[i]).subscribe(
          data => {
            this.snackBar.open('Departments information updated successfully', 'thank you', {
              duration: 2000,
            });
            this.departments[i].state = 'saved';
          },
          error => {
            this.snackBar.open('Error updating information, please try again or notify the IT department', 'Try again', {
              duration: 2000,
            });
          }
        );
      }
    }
  }

  onSaveCli() {
    for (let i = 0; i < this.clients.length; i++ ) {
      if (this.clients[i].state === 'new') {
        // save admService
        this._admService.saveClient(this.clients[i])
        .subscribe(result => {
          this.clients[i].state = 'saved';
        });
        console.log('new identified');
      }else if (this.clients[i].state === 'newPosition') {
        this._admService.updateClient(this.clients[i]).subscribe(result => {
          this.departments[i].state = 'saved';
        });
        console.log('new position identified');
      }else if (this.clients[i].state === 'modified') {
        console.log(this.clients[i]);
        this._admService.updateClient(this.clients[i]).subscribe(result => {
          this.departments[i].state = 'saved';
        console.log('modified identified');
        });
      }
    }
  }

  onAddWp() {
    if ( this.currentWp.state === 'default') {
      const element = new Workpattern('new', '', this.currentWp.name, this.currentWp.shift);
      this.wp.push(element);
    }
  }
  onSaveWp() {
    // for (let i = 0; i < this.wp.length; i++ ) {
    //   if (this.wp[i].state === 'new') {
    //     // save admService
    //     this._admService.saveShift(this.wp[i])
    //     .subscribe(result => {
    //       this.wp[i].state = 'saved';
    //     });
    //   }else if (this.clients[i].state === 'saved') {
    //     this._admService.updateShift(this.wp[i]).subscribe(result => {
    //       this.wp[i].state = 'saved';
    //     });
    //   }
    // }
    const finishedWp = this.wp;
    let i = 0;
    finishedWp.forEach(result => {
      i++;
      let startTime;
      let endTime;
        result.shift.forEach(day => {
          startTime = null;
          endTime = null;
          if (day.startTime !== null) {
          const str: string = day.startTime;
          const strArray = str.split(':');
          const hoursStr = parseInt(strArray[0], 10) * 60;
          const minutesStr = parseInt(strArray[1], 10);
          startTime = hoursStr + minutesStr;
          }
          if (day.endTime !== null) {
            let end: any = day.endTime;
            end = end.split(':');
            const hoursEnd = parseInt(end[0], 10) * 60;
            const minutesEnd = parseInt(end[1], 10);
            endTime = hoursEnd + minutesEnd;
          }
          day.endTime = (endTime === null) ? '' : endTime.toString();
          day.startTime = (startTime === null) ? '' : startTime.toString();
        });
        if (i === finishedWp.length) {
           this._admService.saveShift(finishedWp)
           .subscribe(res => {
             console.log(res);
             this.refreshShiftBut = true;
          }, error => { console.log(error); });
        }
    });
  }
  setSelection(param: any) {
    this.defaultWp = {
    state: 'default',
    _id: '',
    name: 'New',
    shift: [
      new Day(0, false, null, null), new Day(1, false, null, null),
      new Day(2, false, null, null), new Day(3, false, null, null),
      new Day(4, false, null, null), new Day(5, false, null, null),
      new Day(6, false, null, null)]
    };
    this.currentWp = param;
  }

  refreshWp () {
      this.wp.forEach(result => {
        result.shift.forEach(day => {
          if ( day.endTime !== '') {
            const storedEnd = parseInt(day.endTime, 10);
            const hoursEnd = Math.floor(storedEnd / 60);
            const minutesEnd = storedEnd - ( hoursEnd * 60 );
            day.endTime = hoursEnd + ':' + minutesEnd;
          }
          if ( day.startTime !== '') {
            const storedStart = parseInt(day.startTime, 10);
            const hoursStart = Math.floor(storedStart / 60);
            const minutesStart = storedStart - ( hoursStart * 60 );
            day.startTime = hoursStart + ':' + minutesStart;
          }
        });
        this.refreshShiftBut = false;
      });
  }
}
