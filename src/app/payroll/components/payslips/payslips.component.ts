import { PayslipDialogComponent } from './payslip-dialog/payslip-dialog.component';
import { MinuteSecondsPipe } from './../../../shared/pipes/minute-seconds.pipe';
import { PayrollService } from './../../services/payroll.service';
import { Component, OnInit, Input } from '@angular/core';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';

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
