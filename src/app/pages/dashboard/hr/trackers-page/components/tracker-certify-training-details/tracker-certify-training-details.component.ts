import { Component, OnInit, Input } from '@angular/core';
import { Tracker } from '@synergy-app/shared/models';
import { SignatureRenderModalComponent } from '../signature-render-modal/signature-render-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-tracker-certify-training-details',
  templateUrl: './tracker-certify-training-details.component.html',
  styleUrls: ['./tracker-certify-training-details.component.scss'],
})
export class TrackerCertifyTrainingDetailsComponent implements OnInit {
  @Input() trackerInfo: Tracker;
  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}

  openSignatureRenderModal(title: string, signatureBase64: string) {
    this.dialog.open(SignatureRenderModalComponent, {
      data: {
        title,
        signatureBase64,
      },
    });
  }
}
