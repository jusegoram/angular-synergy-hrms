import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Department } from '@synergy-app/shared/models/positions-models';

@Component({
  selector: 'app-create-department-dialog',
  templateUrl: './create-department-dialog.component.html',
  styleUrls: ['./create-department-dialog.component.scss'],
})
export class CreateDepartmentDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CreateDepartmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Department
  ) {}
}
