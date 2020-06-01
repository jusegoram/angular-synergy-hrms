import { Component, OnInit, Input } from '@angular/core';
import { Chance, Tracker } from '@synergy-app/shared/models';
import { MatDialog } from '@angular/material/dialog';
import { SignatureRenderModalComponent } from '../signature-render-modal/signature-render-modal.component';

@Component({
  selector: 'app-tracker-status-change-details',
  templateUrl: './tracker-status-change-details.component.html',
  styleUrls: ['./tracker-status-change-details.component.scss'],
})
export class TrackerStatusChangeDetailsComponent implements OnInit {
  @Input() trackerInfo: Tracker;
  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}

  get chances(): Array<{ nth: string; details: Chance }> {
    return [
      {
        nth: 'First',
        details: this.trackerInfo?.statusChange?.absenteeism.firstChance,
      },
      {
        nth: 'Second',
        details: this.trackerInfo?.statusChange?.absenteeism.secondChance,
      },
      {
        nth: 'Third',
        details: this.trackerInfo?.statusChange?.absenteeism.secondChance,
      },
    ];
  }

  openSignatureRenderModal(title: string, signatureBase64: string) {
    this.dialog.open(SignatureRenderModalComponent, {
      data: {
        title,
        signatureBase64,
      },
    });
  }
}
