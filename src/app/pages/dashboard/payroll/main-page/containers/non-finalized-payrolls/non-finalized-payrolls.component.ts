import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { PayrollService } from '@synergy-app/core/services/payroll.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-non-finalized-payrolls',
  templateUrl: './non-finalized-payrolls.component.html',
  styleUrls: ['./non-finalized-payrolls.component.scss'],
})
export class NonFinalizedPayrollsComponent implements OnInit {
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  finalizedPayrolls$: Observable<any>;
  nonFinalizedPayrolls$: Observable<any>;
  type = [
    {type: '', view: 'All'},
    {type: 'BI-WEEKLY', view: 'Bi-Weekly Payroll'},
    {type: 'SEMIMONTHLY', view: 'Semi-Monthly Payroll'},
  ];
  selectedType = '';
  auth: any;
  user;
  constructor(
    private payrollService: PayrollService,
    public snackBar: MatSnackBar
  ) {
    this.user = this.payrollService.getDecodedToken();
  }

  ngOnInit() {
    this.auth = this.payrollService.getAuth();
    this.fetchNonFinalizedPayrolls();
    this.fetchFinalizedPayrolls();
  }

  fetchFinalizedPayrolls() {
    this.finalizedPayrolls$ = this.payrollService.getPayroll('all', this.selectedType, true);
  }

  fetchNonFinalizedPayrolls() {
    this.nonFinalizedPayrolls$ = this.payrollService.getPayroll('all', this.selectedType, false);
  }

  onPaySelectedPayrolls(selectedPayrolls) {
    if (selectedPayrolls.length === 2) {
      const items = selectedPayrolls;
      const ids = [items[0]._id, items[1]._id];
      const query = this.user;
      this.payrollService.updatePayroll(JSON.stringify(ids), query, 'PAY').subscribe((result) => {
        this.fetchNonFinalizedPayrolls();
      });
    } else {
      this.openSnackBar(`It's only allowed to pay 2 Payrolls at a time`, 'Got it, Thanks!');
    }
  }

  reloadData() {
    this.fetchFinalizedPayrolls();
    this.fetchNonFinalizedPayrolls();
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
    });
  }
}
