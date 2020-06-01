import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeePayroll } from '@synergy-app/shared/models';

@Component({
  selector: 'app-payroll-info',
  templateUrl: './payroll.component.html',
  styleUrls: ['./payroll.component.scss'],
})
export class PayrollComponent implements OnInit {
  @Input() employee: any;
  @Input() authorization: any;
  @Output() onSuccess = new EventEmitter<any>();
  @Output() onError = new EventEmitter<any>();
  @Output() onSaveButtonClicked = new EventEmitter<EmployeePayroll>();
  payroll: EmployeePayroll = {
    _id: '',
    employee: '',
    TIN: '',
    payrollType: '',
    bankName: '',
    bankAccount: '',
    billable: false,
    paymentType: '',
  };
  payrollForm: FormGroup;
  payrollTypes = [
    { value: 'SEMIMONTHLY', name: 'SEMIMONTHLY' },
    { value: 'BI-WEEKLY', name: 'BI-WEEKLY' },
  ];

  constructor(public _formBuilder: FormBuilder) {}

  ngOnInit() {
    Object.assign(this.payroll, this.employee.payroll);
    this.buildForm();
  }

  buildForm() {
    const { _id, TIN, payrollType, bankName, bankAccount, billable, paymentType } = this.payroll,
      { _id: employee } = this.employee;
    this.payrollForm = this._formBuilder.group({
      _id: [_id],
      employee: [employee],
      TIN: [TIN],
      payrollType: [payrollType, Validators.required],
      bankName: [bankName, Validators.required],
      bankAccount: [bankAccount, Validators.required],
      billable: [billable, Validators.required],
      paymentType: [paymentType, Validators.required],
    });
  }

  onSubmit() {
    if (this.payrollForm.valid && this.payrollForm.touched) {
      const payroll: EmployeePayroll = {
        ...this.payrollForm.value,
      };
      this.onSaveButtonClicked.emit(payroll);
    } else {
      return this.payrollForm.markAllAsTouched();
    }
  }
}
