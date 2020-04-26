import { Component } from '@angular/core';
import { PAYROLL_REPORTS } from '@synergy-app/shared/models/reports.constants';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent {
  reports = PAYROLL_REPORTS.sort((a , b ) => a.name.localeCompare(b.name));
  constructor() { }
}
