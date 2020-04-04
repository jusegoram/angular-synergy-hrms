import { Component, OnInit, Input } from '@angular/core';
import { Tracker } from '../../../shared/models/tracker';

@Component({
  selector: 'app-tracker-certify-training-details',
  templateUrl: './tracker-certify-training-details.component.html',
  styleUrls: ['./tracker-certify-training-details.component.scss']
})
export class TrackerCertifyTrainingDetailsComponent implements OnInit {
  @Input() trackerInfo: Tracker;
  constructor() { }

  ngOnInit(): void {
  }

}
