import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { EmployeeService, SessionService } from '@synergy-app/core/services';
import { HrTracker } from '@synergy-app/shared/models';
import Swal from 'sweetalert2';
import { TRACKER_STATUS } from '@synergy/environments';

@Component({
  selector: 'app-trackers',
  templateUrl: './trackers-page.component.html',
  styleUrls: ['./trackers-page.component.scss'],
})
export class TrackersPageComponent implements OnInit, AfterViewInit {
  @ViewChild('trackerInboxTable', { static: false }) trackerInboxTable: any;
  @ViewChild('inputFilter', { static: false }) inputFilter: any;
  pendingTrackersInbox: Array<HrTracker> = [];
  inProgressTrackersInbox: Array<HrTracker> = [];
  isLoading = true;
  currentUserId: string;
  constructor(private employeeService: EmployeeService, private sessionService: SessionService) {}

  ngOnInit() {
    this.currentUserId = this.sessionService.getId();
    this.fetchTrackers();
  }

  ngAfterViewInit() {}

  async fetchTrackers() {
    try {
      this.pendingTrackersInbox = await this.employeeService.getTrackers({
        state: TRACKER_STATUS.PENDING,
      });
      this.inProgressTrackersInbox = await this.employeeService.getTrackers({
        state: TRACKER_STATUS.IN_PROGRESS + '.' + TRACKER_STATUS.DONE,
        verificationFingerprint: this.currentUserId,
      });
    } catch (error) {
      console.log('TrackersComponent', error);
    } finally {
      this.isLoading = false;
    }
  }

  toggleExpandRow(row) {
    this.trackerInboxTable.rowDetail.toggleExpandRow(row);
  }

  saveNewTrackerStatus(hrTracker: Partial<HrTracker>) {
    let message = 'Are you sure you want to accept this track?';
    if (hrTracker.state === TRACKER_STATUS.DONE) {
      message = `By clicking on finish, I ${this.sessionService.getName()},
               agree that the issue in this tracker has been resolved to the best of my ability.
              If for some reason I haven’t been able to resolve the issue I have escalated it to the synergy team`;
    }

    Swal.fire({
      title: 'Confirmation',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'YES',
      cancelButtonText: 'NO',
    }).then(async (result) => {
      if (result.value) {
        try {
          await this.employeeService.updateTracker(hrTracker);
        } catch (error) {
          Swal.fire('Done!', 'Error happened. Try again later.', 'error');
        }
      }
    });
  }
}
