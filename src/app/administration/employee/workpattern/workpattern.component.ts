import { Component, OnInit } from '@angular/core';
import { Workpattern, Day } from '../models/positions-models';
import { AdminService } from '../../services/admin.services';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-workpattern',
  templateUrl: './workpattern.component.html',
  styleUrls: ['./workpattern.component.scss']
})
export class WorkpatternComponent implements OnInit {
  public wp: Workpattern[];

  public currentWp: Workpattern;

  public newWp: string;

  public newShift: Day[];
  public defaultWp: Workpattern;

  selectedWp = 'New';

  refreshShiftBut = false;
  panelState = false;

  constructor(private _admService: AdminService, private snackBar: MatSnackBar) {
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
    this.wp = [
    ];
    this.getSelectedWp();
    this._admService.getShift().subscribe((results: Workpattern[]) => {
      results.forEach(result => {
        result.shift.forEach(day => {
          if (day.endTime !== null && day.startTime !== null) {
            const storedEnd = parseInt(day.endTime, 10);
            const storedStart = parseInt(day.startTime, 10);

            const hoursEnd = Math.floor(storedEnd / 60);
            const minutesEnd = storedEnd - (hoursEnd * 60);

            const hoursStart = Math.floor(storedStart / 60);
            const minutesStart = storedStart - (hoursStart * 60);

            day.endTime = hoursEnd + ':' + minutesEnd;
            day.startTime = hoursStart + ':' + minutesStart;
          }
        });
        this.wp.push(result);
      });
    });
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

  onAddWp() {
    if (this.currentWp.state === 'default') {
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
          const end: string = day.endTime;
          const endArray = end.split(':');
          const hoursEnd = parseInt(endArray[0], 10) * 60;
          const minutesEnd = parseInt(endArray[1], 10);
          endTime = hoursEnd + minutesEnd;
        }
        day.endTime = (endTime === null) ? '' : endTime.toString();
        day.startTime = (startTime === null) ? '' : startTime.toString();
      });
      if (i === finishedWp.length) {
        this._admService.saveShift(finishedWp)
          .subscribe(data => {
            this.snackBar.open('Information saved successfully', 'thank you', {
              duration: 2000,
            });
            this.refreshShiftBut = true;
          },
          error => {
            this.snackBar.open('Error saving information, please try again or notify the IT department', 'Try again', {
              duration: 2000,
            });
          });
      }
    });
  }
  refreshWp() {
    this.wp.forEach(result => {
      result.shift.forEach(day => {
        if (day.endTime !== '') {
          const storedEnd = parseInt(day.endTime, 10);
          const hoursEnd = Math.floor(storedEnd / 60);
          const minutesEnd = storedEnd - (hoursEnd * 60);
          day.endTime = hoursEnd + ':' + minutesEnd;
        }
        if (day.startTime !== '') {
          const storedStart = parseInt(day.startTime, 10);
          const hoursStart = Math.floor(storedStart / 60);
          const minutesStart = storedStart - (hoursStart * 60);
          day.startTime = hoursStart + ':' + minutesStart;
        }
      });
      this.refreshShiftBut = false;
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
}
