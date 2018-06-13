import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent implements OnInit {
templates = [
  {text: 'Main Information', value: '/template'},
  {text: 'Personal Information', value: '/template/personal'},
  {text: 'Company Information', value: '/template/company'},
  {text: 'Position Information', value: '/template/position'},
  {text: 'Payroll Information', value: '/template/payroll'},
  {text: 'Family Information', value: '/template/family'},
  {text: 'Education Information', value: '/template/education'},
];

selected = '/template';
  constructor() { }

  ngOnInit() {
  }

}
