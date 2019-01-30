import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EditDialogComponent } from '../../workpattern/edit-dialog/edit-dialog.component';
import { Department } from '../../models/positions-models';

@Component({
  selector: 'app-create-department-dialog',
  templateUrl: './create-department-dialog.component.html',
  styleUrls: ['./create-department-dialog.component.scss']
})
export class CreateDepartmentDialogComponent {

  constructor( public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Department) {
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

}


