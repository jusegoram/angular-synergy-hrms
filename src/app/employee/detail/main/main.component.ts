import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Employee} from '../../../shared/models/employee/employee';
import {EmployeeService} from '../../employee.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DateAdapter} from '@angular/material/core';

@Component({
  selector: 'main-info',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  @Input('authorization') auth;
  @Input('employee') employee: Employee;
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
    const {_id } = this.employee;
    this.form = this._formBuilder.group({
      _id: [_id],
      dialerId: [this.employee.dialerId],
      firstName: [this.employee.firstName],
      middleName: [this.employee.middleName],
      lastName: [this.employee.lastName],
      gender: [this.employee.gender.toLowerCase()],
      status: [this.employee.status.toLowerCase()],
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
