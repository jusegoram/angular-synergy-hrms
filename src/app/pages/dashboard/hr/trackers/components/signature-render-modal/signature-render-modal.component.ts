import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-signature-render-modal',
  templateUrl: './signature-render-modal.component.html',
  styleUrls: ['./signature-render-modal.component.scss'],
})
export class SignatureRenderModalComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<SignatureRenderModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; signatureBase64: string }
  ) {}

  ngOnInit(): void {}

  closeDialog() {
    this.dialogRef.close();
  }
}
