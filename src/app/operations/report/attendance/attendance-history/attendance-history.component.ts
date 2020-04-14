import { OperationsService } from './../../../operations.service';
import { MatTableDataSource } from '@angular/material/table';
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import moment from 'moment';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-attendance-history',
  templateUrl: './attendance-history.component.html',
  styleUrls: ['./attendance-history.component.scss'],
})
export class AttendanceHistoryComponent implements OnInit, OnChanges {
  @Input() employee;
  @ViewChild('historyPaginator', {read: MatPaginator})
  paginator: MatPaginator;

  dataSource: MatTableDataSource<any>;
  dateRangeForm: FormGroup;
  columns: string[] = ['date', 'name', 'shift', 'timeIn', 'attendance'];
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.employee && changes.employee.currentValue !== undefined) {
      this.buildTable([]);
    }
  }
  constructor(private _operationService: OperationsService, private fb: FormBuilder) {}

  ngOnInit() {
    this.buildForm();
    this.buildTable([]);
  }
  buildForm() {
    this.dateRangeForm = this.fb.group({
      from: [moment().add(-14, 'days').toDate()],
      to: [moment().toDate()],
    });
  }
  refreshData() {
    const { from, to } = this.dateRangeForm.value;
    this._operationService.getAttendanceHistory(this.employee.employeeId, from, to).subscribe((result) => {
      this.buildTable(result);
    });
  }
  buildTable(data) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
  }
}
