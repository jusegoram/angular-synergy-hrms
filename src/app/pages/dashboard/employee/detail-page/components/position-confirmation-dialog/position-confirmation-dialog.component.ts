import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './position-confirmation-dialog.component.html',
  styleUrls: ['./position-confirmation-dialog.component.scss'],
})
export class PositionConfirmationDialogComponent {
  result = false;

  constructor(
    public dialogRef: MatDialogRef<PositionConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  emitResult(param): boolean {
    this.result = true;
    return this.result;
  }
}
