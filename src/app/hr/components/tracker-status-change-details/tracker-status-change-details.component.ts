import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Tracker } from '../../../shared/models/tracker';
import { Chance } from '../../../shared/models/chance';

@Component({
  selector: 'app-tracker-status-change-details',
  templateUrl: './tracker-status-change-details.component.html',
  styleUrls: ['./tracker-status-change-details.component.scss']
})
export class TrackerStatusChangeDetailsComponent implements OnInit, OnChanges {
  @Input() trackerInfo: Tracker;  
  constructor() { }
  
  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    throw new Error("Method not implemented.");
  }

  ngOnInit(): void {
  }  

  get chances():Array<{nth:string, details:Chance}>{
    return [
      {
        nth: 'First',
        details:this.trackerInfo?.statusChange?.absenteeism.firstChance,
      },
      {
        nth: 'Second',
        details:this.trackerInfo?.statusChange?.absenteeism.secondChance,
      },
      {
        nth: 'Third',
        details:this.trackerInfo?.statusChange?.absenteeism.secondChance,
      }
    ];
  }
}
