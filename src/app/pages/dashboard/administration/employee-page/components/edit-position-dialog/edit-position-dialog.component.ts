import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  EditWorkPatternDayDialogComponent
} from '../edit-work-pattern-day-dialog/edit-work-pattern-day-dialog.component';
import { Position } from '@synergy-app/shared/models/positions-models';

@Component({
  selector: 'app-edit-position-dialog',
  templateUrl: './edit-position-dialog.component.html',
  styleUrls: ['./edit-position-dialog.component.scss'],
})
export class EditPositionDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EditWorkPatternDayDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Position) {}
}
