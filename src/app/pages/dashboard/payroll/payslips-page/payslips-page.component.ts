import { PayslipDialogComponent } from '@synergy-app/shared/modals/payslip-dialog/payslip-dialog.component';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-payslips-page',
  templateUrl: './payslips-page.component.html',
  styleUrls: ['./payslips-page.component.scss'],
})
export class PayslipsPageComponent implements OnInit {
  payrollRun: any[];

  constructor(public dialog: MatDialog) {
  }

  ngOnInit() {}
  openDialog() {
    const payslipDialogRef = this.dialog.open(PayslipDialogComponent, {
      width: '500px',
      data: this.payrollRun,
    });
  }
}
