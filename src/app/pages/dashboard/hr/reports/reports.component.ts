import { Component, OnInit } from '@angular/core';
import { HR_REPORTS, WORKFORCE_REPORTS } from '@synergy/environments';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  reports = HR_REPORTS.sort((a , b ) => a.name.localeCompare(b.name));
  constructor() { }

  ngOnInit(): void {
  }

}
