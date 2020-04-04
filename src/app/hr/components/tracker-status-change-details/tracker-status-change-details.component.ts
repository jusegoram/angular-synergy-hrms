import { Component, OnInit, Input } from '@angular/core';
import { Tracker } from '../../../shared/models/tracker';

@Component({
  selector: 'app-tracker-status-change-details',
  templateUrl: './tracker-status-change-details.component.html',
  styleUrls: ['./tracker-status-change-details.component.scss']
})
export class TrackerStatusChangeDetailsComponent implements OnInit {
  @Input() trackerInfo: Tracker;
  constructor() { }

  ngOnInit(): void {
  }

}
