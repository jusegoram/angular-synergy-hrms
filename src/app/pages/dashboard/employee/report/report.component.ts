import { Component } from '@angular/core';
import { WORKFORCE_REPORTS } from '@synergy/environments';


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent {
  reports = WORKFORCE_REPORTS.sort((a , b ) => a.name.localeCompare(b.name));
  constructor() {
  }
}
