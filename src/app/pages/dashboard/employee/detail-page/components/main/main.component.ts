import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Employee } from '@synergy-app/shared/models';
import { FormBuilder, FormGroup } from '@angular/forms';
import { USER_ROLES, LABORAL, SOCIAL } from '@synergy/environments/enviroment.common';

@Component({
  selector: 'app-main-info',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('authorization') auth;
  // tslint:disable-next-line:no-input-rename
  @Input('employee') currentEmployee: Employee;
  @Output() onSubmitButtonClicked = new EventEmitter<Employee>();
  roles = USER_ROLES;
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
  constructor(private _formBuilder: FormBuilder) {
    this.restrictions = LABORAL.RESTRICTIONS;
    this.status = LABORAL.STATUS;
    this.genders = SOCIAL.GENDERS;
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
  onSubmit() {
    if (this.form.valid && this.form.touched) {
      const { value: values } = this.form;
      const query: Employee = {
        ...values,
      };
      this.onSubmitButtonClicked.emit(query);
    }
  }
}
