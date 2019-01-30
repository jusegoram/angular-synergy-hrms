import { Component, OnInit } from '@angular/core';
import { Workpattern, Day } from '../models/positions-models';
import { AdminService } from '../../services/admin.services';
import { MatSnackBar, MatDialog } from '@angular/material';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';
import { NewDialogComponent } from './new-dialog/new-dialog.component';

@Component({
  selector: 'app-workpattern',
  templateUrl: './workpattern.component.html',
  styleUrls: ['./workpattern.component.scss']
})
export class WorkpatternComponent implements OnInit {
  public wp: Workpattern[];
  public currentwp: Workpattern;
  public selectedshift: Workpattern;
  public editDialog;
  public newDialog;
  constructor(private _admService: AdminService, private snackBar: MatSnackBar, public dialog: MatDialog) {

  }
  ngOnInit() {
    this.loadWorkPatterns();
    console.log(this.wp);
  }

   loadWorkPatterns() {
    this.wp = [];
    this._admService.getShift().subscribe((results: Workpattern[]) => {
      results.forEach((e) => this.wp.push(e));
    }, error => {
      console.log(error);
    }
    );
  }

  editShift(id, propName , propValue) {
    const edit = {};
    edit['propName'] = propName;
    edit['propValue'] = propValue;
    this._admService.editShift(edit, id).subscribe(data => {
      this.openSuccess();
    }, error => {
      this.openError();
      console.error(error);
    });
  }
  newShift(shift) {
    this._admService.saveShift(shift).subscribe((data: Workpattern) => {
      this._admService.minutesToTime(data.shift);
      this.wp.push(data);
      this.currentwp = data;
      this.openSuccess();
    }, error => {
      this.openError();
      console.error(error);
    });
  }
  setSelection(event) {
    if (event) {
      this.currentwp = event;
    }
  }
  openSuccess() {
    this.openSnackBar('Great! Everything was done correctly', 'Ok');
  }
  openError() {
    this.openSnackBar('Opps! Something went wrong', 'Notify Synergy Admin');

  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }
  openNewDialog(): void {
    const newWorkPattern = new Workpattern('', '', '',
              [{
                day: 0,
                onShift: null,
                startTime: '',
                endTime: '',
              },
              {
                day: 1,
                onShift: null,
                startTime: '',
                endTime: '',
              },
              {
                day: 2,
                onShift: null,
                startTime: '',
                endTime: '',
              },
              {
                day: 3,
                onShift: null,
                startTime: '',
                endTime: '',
              },
              {
                day: 4,
                onShift: null,
                startTime: '',
                endTime: '',
              },
              {
                day: 5,
                onShift: null,
                startTime: '',
                endTime: '',
              },
              {
                day: 6,
                onShift: null,
                startTime: '',
                endTime: '',
              }, ]);
    const dialogRef = this.dialog.open(NewDialogComponent, {
      width: '500px',
      data: newWorkPattern
    });

    dialogRef.afterClosed().subscribe(result => {
      this.timeToMinutes(result.shift);
      this.newShift(result);
    });
  }
  openEditDialog(event, day): void {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '500px',
      data: this.currentwp.shift[day],
    });

    dialogRef.afterClosed().subscribe(result => {
      this.onSaveWp();
    });
  }

  timeToMinutes(shift) {
      shift = shift.map((day) => {
        this.dayTimeToMinutes(day);
      });
  }

  onSaveWp() {
    const workpatternCopy = JSON.parse(JSON.stringify(this.currentwp));
      this.timeToMinutes(workpatternCopy.shift);
      this.save(workpatternCopy, workpatternCopy._id);
  }
  save(item, id) {
      this._admService.editShift(item, id)
          .subscribe(data => {
            this.openSuccess();
            this._admService.clearShift();
            this.loadWorkPatterns();
          },
          error => {
            this.openError();
            this._admService.clearShift();
            this.loadWorkPatterns();
          });
     }
  dayTimeToMinutes(day) {
    let startTime = null;
        let endTime = null;
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
        day.endTime = (endTime === null) ? null : endTime;
        day.startTime = (startTime === null) ? null : startTime;
  }
  deleteWorkPattern() {
    const i = this.wp.indexOf(this.currentwp);
    this._admService.deleteShift(this.currentwp).subscribe(data => {
      this.openSuccess();
      this.wp.splice(i, 1);
      this.currentwp = this.wp[i - 1];
    }, error => {
      this.openError();
      console.log(error);
    });
   }
}
