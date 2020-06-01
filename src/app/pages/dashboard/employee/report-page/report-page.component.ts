import { Component } from '@angular/core';
import { WORKFORCE_REPORTS } from '@synergy/environments';


@Component({
  selector: 'app-report',
  templateUrl: './report-page.component.html',
  styleUrls: ['./report-page.component.scss'],
})
export class ReportPageComponent {
  reports = WORKFORCE_REPORTS.sort((a , b ) => a.name.localeCompare(b.name));
  constructor() {
  }
}
