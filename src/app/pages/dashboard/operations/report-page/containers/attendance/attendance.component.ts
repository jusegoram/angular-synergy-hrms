import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { OperationsService } from '@synergy-app/core/services/operations.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import moment from 'moment';
import { Observable } from 'rxjs';
import { TIME_VALUES } from '@synergy/environments/enviroment.common';

@Component({
  selector: 'report-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss'],
})
export class AttendanceComponent implements OnInit {
  CurrentTime: Observable<Date>;
  attendanceHistory$: Observable<any>;
  queryForm: FormGroup;
  clients = [];
  campaigns = [];
  dataSource: MatTableDataSource<any>;
  columns: string[] = ['employeeId', 'name', 'shift', 'timeIn', 'attendance', 'action'];
  employeeHistory: any;
  constructor(private operationsService: OperationsService, private fb: FormBuilder) {
    this.CurrentTime = this.operationsService.getClock();
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  // start >= 9:00 && <= 12:00
  // start <= 9:00 && end <= 12:00

  ngOnInit() {
    this.operationsService.getClient().subscribe((result) => (this.clients = result));
    this.buildQueryForm();
  }

  refreshTable(data) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
  }

  applyFilter = (event: Event) => {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getAttendance() {
    this.operationsService.getAttendance({}).subscribe((result) => {
      console.log(result);
    });
  }

  fetchAttendanceHistory(params) {
    const { employeeId, from, to } = params;
    this.attendanceHistory$ = this.operationsService.getAttendanceHistory(employeeId, from, to);
  }

  onHistory(e) {
    this.employeeHistory = e;
  }

  setCampaigns(event: any) {
    this.queryForm.value.Campaign = '';
    this.campaigns = event.campaigns;
  }

  buildQueryForm() {
    this.queryForm = this.fb.group({
      On: [new Date()],
      StartTimeHH: [new Date().getHours()],
      StartTimeMM: ['00'],
      EndTimeHH: [new Date().getHours() + 1],
      EndTimeMM: ['00'],
      Client: ['', Validators.required],
      Campaign: ['', Validators.required],
    });
  }

  onLoad() {
    const v = this.queryForm.value;
    const query = {
      date: moment(v.On).format('MM/DD/YYYY').toString(),
      startTime: this.transformToMinutes(v.StartTimeHH, v.StartTimeMM),
      endTime: this.transformToMinutes(v.EndTimeHH, v.EndTimeMM),
      client: v.Client.name,
      campaign: v.Campaign,
    };
    this.operationsService.getAttendance(query).subscribe((result) => {
      this.refreshTable(result);
    });
  }

  transformToMinutes(hh, mm) {
    let minutes: number;
    if (parseInt(hh, 10) < TIME_VALUES.OVER_ONE_DAY_HOURS && parseInt(mm, 10) < TIME_VALUES.MINUTES_PER_HOUR) {
      minutes = parseInt(hh, 10) * TIME_VALUES.SECONDS_PER_MINUTE + parseInt(mm, 10);
      return minutes;
    }
  }
}
