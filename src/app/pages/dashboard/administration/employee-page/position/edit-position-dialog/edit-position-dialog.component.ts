import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EditDialogComponent } from '../../workpattern/edit-dialog/edit-dialog.component';
import { Position } from '@synergy-app/shared/models/positions-models';

@Component({
  selector: 'app-edit-position-dialog',
  templateUrl: './edit-position-dialog.component.html',
  styleUrls: ['./edit-position-dialog.component.scss'],
})
export class EditPositionDialogComponent {
  constructor(public dialogRef: MatDialogRef<EditDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: Position) {}
}
