import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { HrTracker } from '@synergy-app/shared/models/hr-tracker.model';
import { TRACKER_STATUS, TIME_VALUES } from '@synergy/environments';
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

@Component({
  selector: 'app-accepted-trackers-table',
  templateUrl: './accepted-trackers-table.component.html',
  styleUrls: ['./accepted-trackers-table.component.scss'],
})
export class AcceptedTrackersTableComponent implements OnInit, AfterViewInit {
  @Input() data: Array<HrTracker> = [];
  @Input() isLoading = true;
  @Output() onSavingFinishedTrackerStatus = new EventEmitter<Partial<HrTracker>>();
  @ViewChild('trackerInboxTable', { static: false }) trackerInboxTable: any;
  @ViewChild('inputFilter', { static: false }) inputFilter: any;
  filter = '';
  constructor() {}

  ngOnInit(): void {}

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

  saveFinishedTrackerStatus(hrTracker: HrTracker) {
    const { _id } = hrTracker;
    this.onSavingFinishedTrackerStatus.emit({
      _id,
      state: TRACKER_STATUS.DONE,
    });
  }

  toggleExpandRow(row) {
    this.trackerInboxTable.rowDetail.toggleExpandRow(row);
  }
}
