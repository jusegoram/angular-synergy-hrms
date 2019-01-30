import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Workpattern } from '../../models/positions-models';

@Component({
  selector: 'app-new-dialog',
  templateUrl: './new-dialog.component.html',
  styleUrls: ['./new-dialog.component.scss']
})
export class NewDialogComponent  {

  constructor( public dialogRef: MatDialogRef<NewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Workpattern) {
    }

  setStart(startTime) {
    this.data.shift.map(item => {
      item.startTime = startTime;
    });
  }
  setEnd(endTime) {
    this.data.shift.map(item => {
      item.endTime = endTime;
    });
  }
  setDayOff(day: number) {
    this.data.shift.map(item => {
      if (item.day === day && item.onShift === null) {
        item.onShift = false;
        item.endTime = null;
        item.startTime = null;
      } else if ( item.day === day && item.onShift === true) {
        item.onShift = false;
        item.endTime = null;
        item.startTime = null;
      }else if ( item.day === day && item.onShift === false) {
        item.onShift = true;
      }else if (item.day !== day && item.onShift === null) {
        item.onShift = true;
      }
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
