import { FormControl } from '@angular/forms';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { map, startWith } from 'rxjs/operators';
import { ExportAsConfig, ExportAsService } from 'ngx-export-as';
import { MinuteSecondsPipe } from '@synergy-app/shared/pipes/minute-seconds.pipe';
import { PayrollService } from '@synergy-app/core/services/payroll.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-payslip-dialog',
  templateUrl: './payslip-dialog.component.html',
  styleUrls: ['./payslip-dialog.component.scss'],
})
export class PayslipDialogComponent implements OnInit {
  @ViewChild('sentSwal', {static: false}) sentSwal: SwalComponent;
  @ViewChild('downloadSwal', {static: false}) downloadSwal: SwalComponent;
  myControl: FormControl;
  filteredEmployees: any;
  allEmployees: any;
  employeePayslip: any;
  bulkPayslipSent = false;

  constructor(
    private exportasService: ExportAsService,
    public dialogRef: MatDialogRef<PayslipDialogComponent>,
    private minutesSecondsPipe: MinuteSecondsPipe,
    private payrollService: PayrollService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit() {
    this.bulkPayslipSent = this.data[0].payslipSent ? true : false;
    this.myControl = new FormControl('');
    this.allEmployees = this.data.map((item) => {
      item.fullSearchName = `(${item.employeeId}) ${item.firstName} ${item.middleName} ${item.lastName}`;
      return item;
    });
    this.filteredEmployees = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        return this.allEmployees ? this._filterEmployees(value) : this.allEmployees;
      })
    );
  }
  setEmployee(e) {
    this.employeePayslip = e;
  }
  _filterEmployees(value: string): any[] {
    const filterValue = value.toString().toLowerCase();
    return this.allEmployees.filter((employee) => employee['fullSearchName'].toLowerCase().includes(filterValue));
  }
  onDownload() {
    this.saveToPdf();
  }
  saveToPdf() {
    const config: ExportAsConfig = {
      type: 'pdf',
      elementIdOrContent: 'payslip',
      options: {
        format: 'letter',
        orientation: 'portrait',
      },
    };
    this.exportasService.save(config, `${this.employeePayslip.fullSearchName}`).subscribe(() => {
      this.downloadSwal.fire().then((fired) => {});
    });
  }
  transform(hrs) {
    const result = this.minutesSecondsPipe.transform(hrs);
    return result;
  }
  onSend() {
    const { employeeId, payment_Id } = this.employeePayslip;
    this.payrollService.sendPayslips(employeeId, payment_Id).subscribe((result) => {
      this.sentSwal.fire().then((fired) => {});
    });
  }
  onSendAll() {
    const { payment_Id } = this.data[0];
    this.payrollService.sendPayslips('all', payment_Id).subscribe((result) => {
      this.sentSwal.fire().then((fired) => {
      });
    });
    this.dialogRef.close();
  }
}
