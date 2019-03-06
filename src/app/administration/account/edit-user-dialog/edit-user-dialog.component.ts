import { AdminService } from '../../admin.service';
import { OnInit } from '@angular/core';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, getMatIconFailedToSanitizeUrlError } from '@angular/material';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Employee } from '../../../employee/Employee';
import { startWith, map } from 'rxjs/operators';
@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.scss']
})
export class EditUserDialogComponent implements OnInit{
  items: Array <any>;
  form: FormGroup
  hide = true;
  edit = false;
  create = false;
  delete = false;
  export = false;
  upload = false;
  employees: Employee[];
  employee: string;
  filteredEmployees: Observable<Employee[]>;
  employeeCtrl = new FormControl();
  constructor(private fb: FormBuilder, private _adminService: AdminService, public dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    }
  ngOnInit(){
    this.items = this._adminService.userTypes;
    this.form = this.fb.group({
      fn: [this.data.firstName],
      ln: [this.data.lastName],
      role: [this.data.role],
      username: [this.data.username],
      password: ['', Validators.minLength(10)],
      confirmPw: ['', Validators.minLength(10)]
    });
    this.edit = this.data.rights? this.data.rights.edit: false;
    this.create = this.data.rights? this.data.rights.create: false;
    this.delete = this.data.rights? this.data.rights.delete: false;
    this.export = this.data.rights? this.data.rights.export: false;
    this.upload = this.data.rights? this.data.rights.upload: false;
    this._adminService.getEmployees().subscribe(data => {
      data.map(item => {
        item.fullSearchName =
          "(" +
          item.employeeId +
          ") " +
          item.firstName +
          " " +
          item.middleName +
          " " +
          item.lastName;
      });
      this.employees = data;
    });
    this.filteredEmployees = this.employeeCtrl.valueChanges.pipe(
      startWith(""),
      map(value => {
        return this.employees ? this._filterEmployees(value) : this.employees;
      })
    );
  }
  _filterEmployees(value: string): Employee[] {
    const filterValue = value.toString().toLowerCase();
    return this.employees.filter(employee => {
      return employee["fullSearchName"].toLowerCase().includes(filterValue);
    });
  }

  onSave() {
    let formValue = this.form.value;
    let user = {
      _id:this.data._id,
      firstName: formValue.fn,
      lastName: formValue.ln,
      username: formValue.username,
      role: formValue.role,
      rights: {
        edit: this.edit,
        create: this.create,
        delete: this.delete,
        export: this.export,
        upload: this.upload
      },
      password: formValue.password,
      employee: this.employee
    }
    this.dialogRef.close(user);
  }

  verifyPassword() {
    this.form.valueChanges.subscribe(field => {
      if (this.form.value.password !== this.form.value.confirmPw) {
        this.form.controls.confirmPw.setErrors({mismatch: true});
      } else {
        this.form.controls.confirmPw.setErrors(null);
      }
    });
  }
}

