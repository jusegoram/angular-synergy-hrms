import { OperationsService } from './../../operations.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {

  constructor(private _operationsService: OperationsService) { }

  ngOnInit() {
    setInterval(() => this.getAttendance(), 10000);

  }

  getAttendance(){
    this._operationsService.getAttendance({}).subscribe(result => {
      console.log(result);
    })
  }

}
