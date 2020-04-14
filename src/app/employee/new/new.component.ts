import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../employee.service';
import { Employee } from '../../shared/models/employee/employee';
import { Router } from '../../../../node_modules/@angular/router';
import { OnSuccessAlertComponent } from '../../shared/modals/on-success-alert/on-success-alert.component';
import { OnErrorAlertComponent } from '../../shared/modals/on-error-alert/on-error-alert.component';

@Component({
  selector: 'new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss'],
})
export class NewComponent implements OnInit {
  @ViewChild('successAlert', {static: false})
  successAlert: OnSuccessAlertComponent;
  @ViewChild('onErrorAlert', {static: false})
  onErrorAlert: OnErrorAlertComponent;
  formGroup: FormGroup;
  auth = false;

  genders = [
    {value: 'male', viewValue: 'Male'},
    {value: 'female', viewValue: 'Female'},
  ];

  constructor(
    private _service: EmployeeService,
    private _formBuilder: FormBuilder,
    private router: Router
  ) {
  }


  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.formGroup = this._formBuilder.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      status: ['', Validators.required],
      socialSecurity: ['', Validators.required],
    });
  }

  async onSubmit() {
    const employee: Employee = {
      ...this.formGroup.value
    };
    try {
      const result = await this._service.saveEmployee(employee).toPromise();
      setTimeout(() => this.router.navigateByUrl('/employee/detail?id=' + result['_id']), 200);
      return this.successAlert.fire();
    } catch (e) {
      return this.onErrorAlert.fire();
    }
  }
}
