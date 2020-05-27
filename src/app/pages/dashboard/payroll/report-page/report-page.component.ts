import { Component } from '@angular/core';
import { PAYROLL_REPORTS } from '@synergy/environments';

@Component({
  selector: 'app-report-page',
  templateUrl: './report-page.component.html',
  styleUrls: ['./report-page.component.scss']
})
export class ReportPageComponent {
  reports = PAYROLL_REPORTS.sort((a , b ) => a.name.localeCompare(b.name));
  constructor() { }
}
