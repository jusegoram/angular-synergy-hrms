import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Day } from '@synergy-app/shared/models/positions-models';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss'],
})
export class EditDialogComponent {
  constructor(public dialogRef: MatDialogRef<EditDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: Day) {}

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
