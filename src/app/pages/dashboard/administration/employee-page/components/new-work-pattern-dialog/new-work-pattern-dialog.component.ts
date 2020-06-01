import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Workpattern } from '@synergy-app/shared/models/positions-models';

@Component({
  selector: 'app-new-dialog',
  templateUrl: './new-work-pattern-dialog.component.html',
  styleUrls: ['./new-work-pattern-dialog.component.scss'],
})
export class NewWorkPatternDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<NewWorkPatternDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Workpattern) {}

  setStart(startTime) {
    this.data.shift.map((item) => {
      item.startTime = startTime;
    });
  }
  setEnd(endTime) {
    this.data.shift.map((item) => {
      item.endTime = endTime;
    });
  }
  setDayOff(day: number) {
    this.data.shift.map((item) => {
      if (item.day === day && item.onShift === null) {
        item.onShift = false;
        item.endTime = null;
        item.startTime = null;
      } else if (item.day === day && item.onShift === true) {
        item.onShift = false;
        item.endTime = null;
        item.startTime = null;
      } else if (item.day === day && item.onShift === false) {
        item.onShift = true;
      } else if (item.day !== day && item.onShift === null) {
        item.onShift = true;
      }
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
