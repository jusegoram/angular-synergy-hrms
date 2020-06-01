import { TitleCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Employee, EmployeePersonal } from '@synergy-app/shared/models';
import { LOCATION, SOCIAL } from '@synergy/environments';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss'],
})
export class PersonalComponent implements OnInit {
  @Input() employee: Employee;
  @Input() authorization: any;
  @Output() onSaveButtonClicked = new EventEmitter<EmployeePersonal>();

  personal: EmployeePersonal = {
    _id: '',
    employee: '',
    maritalStatus: '',
    amountOfChildren: null,
    address: '',
    town: '',
    district: '',
    addressDate: null,
    celNumber: '',
    telNumber: '',
    birthDate: null,
    birthPlaceDis: '',
    birthPlaceTow: '',
    emailAddress: '',
    emailDate: null,
    hobbies: [],
  };
  maritalStatus = SOCIAL.MARITAL_STATUS;
  districts = LOCATION.DISTRICTS;
  towns = LOCATION.TOWNS;
  children = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }];
  myForm: FormGroup;
  hobbies: any[] = [];
  hobbiesForm: FormGroup;
  hobbiesDataSource: any;

  // sand hill, August Pine Ridge,Double Head Cabbage, San Lazaro Village,
  // libertad village, palmar village, santa rita,
  // TODO: add town and district
  constructor(public snackBar: MatSnackBar, private fb: FormBuilder, private titleCasePipe: TitleCasePipe) {}

  ngOnInit() {
    Object.assign(this.personal, this.employee.personal);
    this.hobbies = this.personal ? this.personal.hobbies : [];
    this.buildForm(this.personal);
    this.buildHobbiesForm();
    this.buildHobbiesTable(this.hobbies);
  }

  buildForm(arg?: EmployeePersonal) {
    const formGroup = {
      birthDate: [arg.birthDate, Validators.required],
      birthPlaceDis: [this.titleCasePipe.transform(arg.birthPlaceDis)],
      birthPlaceTow: [this.titleCasePipe.transform(arg.birthPlaceTow)],
      maritalStatus: [this.titleCasePipe.transform(arg.maritalStatus), Validators.required],
      amountOfChildren: [arg.amountOfChildren ? arg.amountOfChildren : 0],
      address: [this.titleCasePipe.transform(arg.address), Validators.required],
      town: [this.titleCasePipe.transform(arg.town), Validators.required],
      district: [this.titleCasePipe.transform(arg.district), Validators.required],
      addressDate: [arg.addressDate],
      celNumber: [arg.celNumber],
      telNumber: [arg.telNumber],
      emailAddress: [arg.emailAddress, [Validators.email, Validators.required]],
      emailDate: [arg.emailDate],
    };
    this.myForm = this.fb.group(formGroup);
  }

  buildHobbiesForm() {
    this.hobbiesForm = this.fb.group({
      hobbyTitle: ['', Validators.required],
      hobbyComment: ['', Validators.required],
    });
  }

  buildHobbiesTable(hobbies) {
    this.hobbiesDataSource = new MatTableDataSource(hobbies);
  }

  onAddHobby() {
    if (this.hobbiesForm.valid && this.hobbiesForm.touched) {
      const values = this.hobbiesForm.value;
      this.hobbies.push({
        hobbyTitle: values.hobbyTitle,
        hobbyComment: values.hobbyComment,
      });
      this.buildHobbiesTable(this.hobbies);
      this.onSubmit();
    } else {
      this.hobbiesForm.markAllAsTouched();
    }
  }

  onSubmit() {
    if (this.myForm.valid && this.myForm.touched) {
      const { value: values } = this.myForm;
      const employeePersonal: EmployeePersonal = {
        _id: this.personal._id,
        employee: this.employee._id,
        ...values,
        hobbies: this.hobbies,
      };
      employeePersonal.emailDate =
        this.personal.emailAddress !== employeePersonal.emailAddress ? new Date() : this.personal.emailDate;
      employeePersonal.addressDate =
        this.personal.address !== employeePersonal.address ? new Date() : this.personal.addressDate;

      this.onSaveButtonClicked.emit(employeePersonal);
      this.hobbiesForm.reset();
    } else {
      this.myForm.markAllAsTouched();
    }
  }
}
