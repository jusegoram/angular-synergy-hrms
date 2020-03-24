import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-request-info-change-dialog',
  templateUrl: './request-info-change-dialog.component.html',
  styleUrls: ['./request-info-change-dialog.component.scss']
})
export class RequestInfoChangeDialogComponent {

  constructor( public dialogRef: MatDialogRef<RequestInfoChangeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}


    onProceedClick(): void {
      this.dialogRef.close(true);
    }
    onCancelClick(): void {
      this.dialogRef.close();
    }

}





