import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-certify-dialog',
  templateUrl: './certify-dialog.component.html',
  styleUrls: ['./certify-dialog.component.scss']
})
export class CertifyDialogComponent {
  certifyForm: FormGroup;
  constructor( public dialogRef: MatDialogRef<CertifyDialogComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.certifyForm = this.formBuilder.group({
      certificationDate: [new Date(), Validators.required],
      managerSignature: ['', Validators.required],
    });
  }

  get certificationDateHasError() {
    return this.certifyForm.get('certificationDate').invalid;
  }

  onProceedClick(): void {
    this.dialogRef.close();
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
