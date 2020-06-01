import { Component, OnInit, Input } from '@angular/core';
import { Tracker } from '@synergy-app/shared/models/tracker.model';

@Component({
  selector: 'app-tracker-info-change-request-details',
  templateUrl: './tracker-info-change-request-details.component.html',
  styleUrls: ['./tracker-info-change-request-details.component.scss'],
})
export class TrackerInfoChangeRequestDetailsComponent implements OnInit {
  @Input() trackerInfo: Tracker;
  constructor() {}

  ngOnInit(): void {}
}
