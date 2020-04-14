import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Employee } from '../../../shared/models/employee/employee';
import { EmployeeService } from '../../employee.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'main-info',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('authorization') auth;
  // tslint:disable-next-line:no-input-rename
  @Input('employee') currentEmployee: Employee;
  @Output() onSuccess = new EventEmitter<any>();
  @Output() onError = new EventEmitter<any>();
  public form: FormGroup;
  public currentPositionForm: FormGroup;
  private status;
  private genders;
  constructor(
    private _service: EmployeeService,
    private _formBuilder: FormBuilder) {
    this.status = this._service.status;
    this.genders = this._service.genders;
  }

  ngOnInit() {
    this.buildForms();
  }
  buildForms() {
    const {_id } = this.currentEmployee;
    this.form = this._formBuilder.group({
      _id: [_id],
      dialerId: [this.currentEmployee.dialerId],
      firstName: [this.currentEmployee.firstName],
      middleName: [this.currentEmployee.middleName],
      lastName: [this.currentEmployee.lastName],
      gender: [this.currentEmployee.gender.toLowerCase()],
      status: [this.currentEmployee.status.toLowerCase()],
    });

  }
  async onSubmit() {
    if (this.form.valid && this.form.touched) {
      const {value: values} = this.form;
      const query: Employee = {
        ...values,
      };
      try {
        await this._service.updateEmployee(query).toPromise();
        return this.onSuccess.emit();
      } catch (e) {
        return this.onError.emit();
      }
    }
  }
}
