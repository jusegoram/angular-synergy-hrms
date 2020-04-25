import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Employee } from '@synergy-app/shared/models/employee/employee';
import { EmployeeService } from '@synergy-app/shared/services/employee.service';
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
  employee: Employee = {
    _id: '',
    restriction: null,
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    status: '',
    socialSecurity: '',
  };
   form: FormGroup;
   currentPositionForm: FormGroup;
   status;
   genders;
   restrictions;
  constructor(
    private _service: EmployeeService,
    private _formBuilder: FormBuilder) {
    this.restrictions = this._service.restrictions;
    this.status = this._service.status;
    this.genders = this._service.genders;
  }

  ngOnInit() {
    Object.assign(this.employee, this.currentEmployee);
    this.buildForms();
  }
  buildForms() {
    this.form = this._formBuilder.group({
      _id: [this.currentEmployee._id],
      restriction: [this.currentEmployee.restriction],
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
