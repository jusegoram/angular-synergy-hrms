import { Component, OnInit, Input } from '@angular/core';
import { Tracker } from '@synergy-app/shared/models';
import { MatDialog } from '@angular/material/dialog';
import { SignatureRenderModalComponent } from '../signature-render-modal/signature-render-modal.component';

@Component({
  selector: 'app-tracker-transfer-details',
  templateUrl: './tracker-transfer-details.component.html',
  styleUrls: ['./tracker-transfer-details.component.scss'],
})
export class TrackerTransferDetailsComponent implements OnInit {
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
