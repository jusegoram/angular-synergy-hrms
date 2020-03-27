import {PayslipDialogComponent} from './payslip-dialog/payslip-dialog.component';
import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-payslips',
  templateUrl: './payslips.component.html',
  styleUrls: ['./payslips.component.scss']
})
export class PayslipsComponent implements OnInit {
 @Input() payrollRun: any[];

  constructor(
    public dialog: MatDialog
    ) { }

  ngOnInit() {
  }
  openDialog() {
    const payslipDialogRef = this.dialog.open(PayslipDialogComponent, {
      width: '500px',
      data: this.payrollRun
    });
  }
}
