import { Component } from '@angular/core';
import { OPERATIONS_REPORTS } from '@synergy/environments';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent {
  reports = OPERATIONS_REPORTS.sort((a , b ) => a.name.localeCompare(b.name));
  displayedColumns2 = ['employeeId'];
  constructor() {}
}
