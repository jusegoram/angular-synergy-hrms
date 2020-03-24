import {Component, Input, OnInit} from '@angular/core';
import {EmployeeService} from '../../employee.service';
import {SessionService} from '../../../session/session.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormBuilder, FormGroup} from '@angular/forms';
import {EmployeePayroll} from '../../Employee';

@Component({
  selector: 'payroll-info',
  templateUrl: './payroll.component.html',
  styleUrls: ['./payroll.component.scss']
})
export class PayrollComponent implements OnInit {
  @Input() payroll: any;
  @Input() employee: any;
  @Input() authorization: any;
  new: boolean;
  isAuth: boolean;
  newPayroll: EmployeePayroll;
  payrollForm: FormGroup;
  payrollTypes = [
    { value: 'SEMIMONTHLY', name: 'SEMIMONTHLY' },
    { value: 'BI-WEEKLY', name: 'BI-WEEKLY' },
  ];


  constructor(private employeeService: EmployeeService,
    private sessionService: SessionService,
    public snackBar: MatSnackBar,
    public fb: FormBuilder) {
    this.newPayroll = new EmployeePayroll('', '', '', '', '', '', '', null, '');
    this.new = false;
  }


  ngOnInit() {
    if (!this.payroll) {
      this.payroll = this.newPayroll;
      this.new = true;
    }
    this.payrollForm = this.fb.group({
      TIN: [this.payroll.TIN],
      payrollType: [this.payroll.payrollType] ,
      bankName: [this.payroll.bankName],
      bankAccount: [this.payroll.bankAccount],
      billable: [this.payroll.billable],
      paymentType: [this.payroll.paymentType]
    });

  }
  onSubmit() {
    if (this.new) {
      const post = new EmployeePayroll(
        '',
        this.employee.employeeId,
        this.employee._id,
        this.payrollForm.value.TIN,
        this.payrollForm.value.payrollType,
        this.payrollForm.value.bankName,
        this.payrollForm.value.bankAccount,
        this.payrollForm.value.billable,
        this.payrollForm.value.paymentType);
      this.employeeService.savePayroll(post).subscribe(
        data => {
          this.snackBar.open('Employee information updated successfully', 'thank you', {
            duration: 2000,
          });
        },
        error => {
          this.snackBar.open('Error updating information, please try again or notify the IT department', 'Try again', {
            duration: 2000,
          });
        }
      );
    }else {
      const update = new EmployeePayroll(
        this.payroll._id,
        this.payroll.employeeId,
        this.payroll.employee,
        this.payrollForm.value.TIN,
        this.payrollForm.value.payrollType,
        this.payrollForm.value.bankName,
        this.payrollForm.value.bankAccount,
        this.payrollForm.value.billable,
        this.payrollForm.value.paymentType);
      this.employeeService.updatePayroll(update).subscribe(
        data => {
          this.snackBar.open('Employee information updated successfully', 'thank you', {
            duration: 2000,
          });
        },
        error => {
          this.snackBar.open('Error updating information, please try again or notify the IT department', 'Try again', {
            duration: 2000,
          });
        }
      );
    }

  }

}
