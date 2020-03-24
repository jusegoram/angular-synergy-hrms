import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-certify-dialog',
  templateUrl: './certify-dialog.component.html',
  styleUrls: ['./certify-dialog.component.scss']
})
export class CertifyDialogComponent {

  constructor( public dialogRef: MatDialogRef<CertifyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
  }
  onProceedClick(): void {
    this.dialogRef.close(true);
  }
  onCancelClick(): void {
    this.dialogRef.close();
  }
}
