import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Day } from '../../models/positions-models';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})
export class EditDialogComponent {

  constructor( public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Day) {
    }

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
