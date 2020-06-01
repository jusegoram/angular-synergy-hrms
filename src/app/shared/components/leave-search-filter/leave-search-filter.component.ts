import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  Input,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { TIME_VALUES } from '@synergy/environments';
import { LeaveRequest } from '@synergy-app/shared/models';

@Component({
  selector: 'app-leave-search-filter',
  templateUrl: './leave-search-filter.component.html',
  styleUrls: ['./leave-search-filter.component.scss'],
})
export class LeaveSearchFilterComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('inputFilter', { static: false }) inputFilter: any;
  @Input() leaves: Array<LeaveRequest> = [];
  @Input() selectedLeaveStatusType = -2;
  @Output() onLeavesFiltered = new EventEmitter<Array<LeaveRequest>>();
  filter = '';

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    this.filterData();
  }

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
        this.filterData();
      });
  }

  filterData() {
    if ((this.selectedLeaveStatusType > -2 || this.filter) && this.leaves) {
      const filterNormalized = this.filter.toLowerCase();
      const dataFiltered = this.leaves.filter((item: LeaveRequest) => {
        return (
          (this.selectedLeaveStatusType > -2 ? item.state === this.selectedLeaveStatusType : true) &&
          (item.employee?.employeeId.includes(filterNormalized) ||
            item.employee?.fullName.toLowerCase().includes(filterNormalized) ||
            item.leaveType?.name.toLowerCase().includes(filterNormalized))
        );
      });
      return this.onLeavesFiltered.emit(dataFiltered);
    }

    this.onLeavesFiltered.emit(this.leaves);
  }
}
