import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-payroll-detail',
  templateUrl: './edit-payroll-detail.component.html',
  styleUrls: ['./edit-payroll-detail.component.scss'],
})
export class EditPayrollDetailComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<EditPayrollDetailComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {}
  onClose() {
    this.dialogRef.close();
  }
}
