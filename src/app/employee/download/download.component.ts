import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent implements OnInit {
templates = [
  {text: 'Main Information', value: '/api/v1/employee/template'},
  {text: 'Personal Information', value: '/api/v1/employee/template/personal'},
  {text: 'Company Information', value: '/api/v1/employee/template/company'},
  {text: 'Position Information', value: '/api/v1/employee/template/position'},
  {text: 'Payroll Information', value: '/api/v1/employee/template/payroll'},
  {text: 'Family Information', value: '/api/v1/employee/template/family'},
  {text: 'Education Information', value: '/api/v1/employee/template/education'},
];

selected = '/template';
  constructor() { }

  ngOnInit() {
  }

}
