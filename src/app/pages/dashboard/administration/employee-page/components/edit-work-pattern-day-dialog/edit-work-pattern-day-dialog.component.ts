import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Day } from '@synergy-app/shared/models/positions-models';

@Component({
  selector: 'app-edit-work-pattern-day-dialog',
  templateUrl: './edit-work-pattern-day-dialog.component.html',
  styleUrls: ['./edit-work-pattern-day-dialog.component.scss'],
})
export class EditWorkPatternDayDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EditWorkPatternDayDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Day) {}

  onShiftChange() {
    if (!this.data.onShift) {
      this.data.endTime = null;
      this.data.startTime = null;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
