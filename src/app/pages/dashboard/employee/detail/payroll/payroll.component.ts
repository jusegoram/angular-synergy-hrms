import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EmployeeService } from '@synergy-app/shared/services/employee.service';
import { SessionService } from '@synergy-app/shared/services/session.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeePayroll } from '@synergy-app/shared/models/employee/employee';

@Component({
  selector: 'payroll-info',
  templateUrl: './payroll.component.html',
  styleUrls: ['./payroll.component.scss'],
})
export class PayrollComponent implements OnInit {
  @Input() employee: any;
  @Input() authorization: any;
  @Output() onSuccess = new EventEmitter<any>();
  @Output() onError = new EventEmitter<any>();
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
    {value: 'SEMIMONTHLY', name: 'SEMIMONTHLY'},
    {value: 'BI-WEEKLY', name: 'BI-WEEKLY'},
  ];

  constructor(
    private _service: EmployeeService,
    private _session: SessionService,
    public _formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    Object.assign(this.payroll, this.employee.payroll);
    this.buildForm();
  }

  buildForm() {
    const {
        _id, TIN, payrollType, bankName, bankAccount, billable, paymentType
      } = this.payroll,
      {_id: employee} = this.employee;
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

  async savePayroll() {
    const {value: values} = this.payrollForm;
    const payroll: EmployeePayroll = {
      ...values
    };
    delete payroll._id;
    try {
      await this._service.savePayroll(payroll).toPromise();
      return this.onSuccess.emit();
    } catch (e) {
      return this.onError.emit();
    }
  }

  async updatePayroll() {
    const {value: values} = this.payrollForm;
    const payroll: EmployeePayroll = {
      ...values
    };
    try {
      await this._service.updatePayroll(payroll).toPromise();
      return this.onSuccess.emit();
    } catch (e) {
      return this.onError.emit();
    }
  }

  onSubmit() {
    if (this.payrollForm.valid && this.payrollForm.touched) {
      return this.payrollForm.value._id === '' ? this.savePayroll() : this.updatePayroll();
    } else {
      return this.payrollForm.markAllAsTouched();
    }
  }
}
