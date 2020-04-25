import { ChangeDetectorRef, Component } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DateAdapter, SatCalendar, SatCalendarFooter, SatDatepicker } from 'saturn-datepicker';
import moment from 'moment';

@Component({
  templateUrl: './ranges-footer.component.html'
})
export class RangesFooterComponent<Date> implements SatCalendarFooter<Date> {
  public ranges: Array<{key: string, label: string}> = [
    {key: 'twoWeeks', label: '2W'},
    {key: 'lastWeek', label: '1W'},
    {key: 'thisWeek', label: 'THIS WEEK'},
    {key: 'today', label: 'TODAY'},
  ];
  private destroyed = new Subject<void>();

  constructor(
    private calendar: SatCalendar<Date>,
    private datePicker: SatDatepicker<Date>,
    private dateAdapter: DateAdapter<Date>,
    cdr: ChangeDetectorRef
  ) {
    calendar.stateChanges
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => cdr.markForCheck());
  }

  setRange(range: string) {
    switch (range) {
      case 'twoWeeks':
        this.calendar.beginDate = this.dateAdapter.deserialize(moment().weekday(1).subtract(2, 'week').toDate());
        this.calendar.endDate = this.dateAdapter.deserialize(moment().weekday(0).subtract(1, 'week').toDate());
        break;
      case 'lastWeek':
        this.calendar.beginDate = this.dateAdapter.deserialize(moment().weekday(1).subtract(1, 'week').toDate());
        this.calendar.endDate = this.dateAdapter.deserialize(moment().weekday(0).toDate());
        break;
      case 'today':
        this.calendar.beginDate = this.dateAdapter.deserialize(new Date());
        this.calendar.endDate = this.dateAdapter.deserialize(new Date());
        this.calendar.activeDate = this.calendar.beginDate;
        break;
      case 'thisWeek':
        const today = moment();
        this.calendar.beginDate = this.dateAdapter.deserialize(today.weekday(1).toDate());
        this.calendar.endDate = this.dateAdapter.deserialize(today.add(1, 'week').weekday(0).toDate());
        break;
    }
    this.calendar.activeDate = this.calendar.beginDate;
    this.calendar.beginDateSelectedChange.emit(this.calendar.beginDate);
    this.calendar.dateRangesChange.emit({begin: this.calendar.beginDate, end: this.calendar.endDate});
    this.datePicker.close();
  }
}
