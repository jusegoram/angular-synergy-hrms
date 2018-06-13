import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { SessionService } from '../../../session/services/session.service';
import { MatSnackBar } from '@angular/material';
import {FormGroup, FormControl, FormBuilder} from '@angular/forms';
import { Params, ActivatedRoute } from '@angular/router';
import { EmployeePayroll} from '../../Employee';

@Component({
  selector: 'payroll-info',
  templateUrl: './payroll.component.html',
  styleUrls: ['./payroll.component.scss']
})
export class PayrollComponent implements OnInit {
  @Input() payroll: any;
  @Input() employee: any;
  @Input() authorization: boolean;
  new: boolean;
  isAuth: boolean;
  newPayroll: EmployeePayroll;
  payrollForm: FormGroup;
  payrollTypes = [
    { value: 'semimonthly', name: 'Semimonthly' },
    { value: 'biweekly', name: 'Biweekly' },
  ];


  constructor(private employeeService: EmployeeService,
    private sessionService: SessionService,
    public snackBar: MatSnackBar,
    public fb: FormBuilder) {
    this.newPayroll = new EmployeePayroll('', '', '', '', '', '', '', '', null);
    this.isAuth = true;
    this.new = false;
  }

//   ngOnChanges(changes: SimpleChanges) {
//     if (this.employeeId !== "" && changes['employeeId']) {
//       this.loadInfo();
//     }
//   }
  ngOnInit() {
    if (!this.payroll) {
      this.payroll = this.newPayroll;
      this.new = true;
    }
    this.payrollForm = this.fb.group({
      TIN: [this.payroll.TIN],
      positionid: [this.payroll.positionid ],
      payrollType: [this.payroll.payrollType] ,
      bankName: [this.payroll.bankName],
      bankAccount: [this.payroll.bankAccount],
      billable: [this.payroll.billable]
    });

  }
  onSubmit() {
    if (this.new) {
      const post = new EmployeePayroll(
        '',
        this.employee.employeeId,
        this.employee._id,
        this.payrollForm.value.TIN,
        this.payrollForm.value.positionid,
        this.payrollForm.value.payrollType,
        this.payrollForm.value.bankName,
        this.payrollForm.value.bankAccount,
        this.payrollForm.value.billable);
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
        this.payrollForm.value.positionid,
        this.payrollForm.value.payrollType,
        this.payrollForm.value.bankName,
        this.payrollForm.value.bankAccount,
        this.payrollForm.value.billable);
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
