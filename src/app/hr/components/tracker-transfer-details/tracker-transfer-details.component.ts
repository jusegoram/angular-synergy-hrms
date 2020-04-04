import { Component, OnInit, Input } from '@angular/core';
import { Tracker } from '../../../shared/models/tracker';

@Component({
  selector: 'app-tracker-transfer-details',
  templateUrl: './tracker-transfer-details.component.html',
  styleUrls: ['./tracker-transfer-details.component.scss']
})
export class TrackerTransferDetailsComponent implements OnInit {
  @Input() trackerInfo: Tracker;

  constructor() { }

  ngOnInit(): void {
  }

}
