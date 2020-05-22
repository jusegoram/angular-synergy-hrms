import { Component } from '@angular/core';
import { OPERATIONS_REPORTS } from '@synergy/environments';

@Component({
  selector: 'app-report-page',
  templateUrl: './report-page.component.html',
  styleUrls: ['./report-page.component.scss'],
})
export class ReportPageComponent {
  reports = OPERATIONS_REPORTS.sort((a , b ) => a.name.localeCompare(b.name));
  displayedColumns2 = ['employeeId'];
  constructor() {}
}
