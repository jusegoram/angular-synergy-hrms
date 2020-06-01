import { Component, OnInit, ViewChild, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { HrTracker } from '@synergy-app/shared/models';
import { TRACKER_STATUS, TIME_VALUES } from '@synergy/environments';
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

@Component({
  selector: 'app-trackers-inbox-table',
  templateUrl: './trackers-inbox-table.component.html',
  styleUrls: ['./trackers-inbox-table.component.scss'],
})
export class TrackersInboxTableComponent implements OnInit, AfterViewInit {
  @Input() data: Array<HrTracker> = [];
  @Input() isLoading = true;
  @Input() userId: string;
  @Output() onSavingAcceptedTrackerStatus = new EventEmitter<Partial<HrTracker>>();
  @ViewChild('trackerInboxTable', { static: false }) trackerInboxTable: any;
  @ViewChild('inputFilter', { static: false }) inputFilter: any;
  filter = '';

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.setUpInputFilter();
  }

  setUpInputFilter() {
    fromEvent(this.inputFilter.nativeElement, 'keydown')
      .pipe(
        debounceTime(TIME_VALUES.SHORT_DEBOUNCE_TIME),
        map((event: any) => event.target.value)
      )
      .subscribe((value) => {
        this.filter = value.trim();
      });
  }

  get filteredData(): Array<HrTracker> {
    if (this.filter && this.data) {
      const filterNormalized = this.filter.toLowerCase();
      return this.data.filter((item: HrTracker) => {
        return (
          item.employeeId.includes(filterNormalized) ||
          item.employee?.fullName.toLowerCase().includes(filterNormalized) ||
          item.trackerTypeName.toLowerCase().includes(filterNormalized) ||
          item.stateName.toLowerCase().includes(filterNormalized) ||
          item.requestDateFormatted.includes(filterNormalized) ||
          item.deadlineDateFormatted.includes(filterNormalized) ||
          item.creationFingerprint.name?.toLowerCase().includes(filterNormalized)
        );
      });
    }
    return this.data;
  }

  toggleExpandRow(row) {
    this.trackerInboxTable.rowDetail.toggleExpandRow(row);
  }

  saveAcceptedTrackerStatus(hrTracker: HrTracker) {
    const { _id } = hrTracker;
    this.onSavingAcceptedTrackerStatus.emit({
      _id,
      state: TRACKER_STATUS.IN_PROGRESS,
      verificationFingerprint: this.userId,
    });
  }
}
