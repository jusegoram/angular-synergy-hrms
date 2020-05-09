import { TitleCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EmployeeService } from '@synergy-app/core/services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Employee, EmployeePersonal } from '@synergy-app/shared/models';

@Component({
  selector: 'personal-info',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss'],
})
export class PersonalComponent implements OnInit {
  @Input() employee: Employee;
  @Input() authorization: any;
  @Output() onSuccess = new EventEmitter<any>();
  @Output() onError = new EventEmitter<any>();

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
  marStatus = [
    { value: 'Single', name: 'Single' },
    { value: 'Married', name: 'Married/Remarried' },
    { value: 'Separated', name: 'Separated' },
    { value: 'Common Law', name: 'Common Law' },
    { value: 'Divorced', name: 'Divorced' },
    { value: 'Widowed', name: 'Widowed' },
  ];
  districts = [
    { value: 'Corozal', name: 'Corozal' },
    { value: 'Orange Walk', name: 'Orange Walk' },
    { value: 'Belize', name: 'Belize' },
    { value: 'Belmopan', name: 'Belmopan' },
    { value: 'Cayo', name: 'Cayo' },
    { value: 'Stann Creek', name: 'Stann Creek' },
    { value: 'Toledo', name: 'Toledo' },
  ];
  towns = [
    { value: 'August Pine Ridge', name: 'August Pine Ridge' },
    { value: 'Belize City', name: 'Belize City' },
    { value: 'Bella Vista', name: 'Bella Vista' },
    { value: 'Belmopan', name: 'Belmopan' },
    { value: 'Benque Viejo', name: 'Benque Viejo' },
    { value: 'Biscayne Village', name: 'Biscayne Village' },
    { value: 'Boston Village', name: 'Boston Village' },
    { value: 'Burrell Boom', name: 'Burrell Boom' },
    { value: 'Camalote', name: 'Camalote' },
    { value: 'Carmelita', name: 'Carmelita' },
    { value: 'Concepcion Village', name: 'Concepcion Village' },
    { value: 'Corozal Town', name: 'Corozal Town' },
    { value: 'Cotton Tree Village', name: 'Cotton Tree Village' },
    { value: 'Crooked Tree', name: 'Crooked Tree' },
    { value: 'Dangriga', name: 'Dangriga' },
    { value: 'Double Head Cabbage', name: 'Double Head Cabbage' },
    { value: 'Gardenia Village', name: 'Gardenia Village' },
    { value: 'Guinea Grass Village', name: 'Guinea Grass Village' },
    { value: 'Hattieville', name: 'Hattieville' },
    { value: 'Independence', name: 'Independence' },
    { value: 'Ladyville', name: 'Ladyville' },
    { value: 'Libertad Village', name: 'Libertad Village' },
    { value: 'Little belize', name: 'Little belize' },
    { value: 'Lords Bank', name: 'Lords Bank' },
    { value: 'Mahogany Heights', name: 'Mahogany Heights' },
    { value: 'Maskall Village', name: 'Maskall Village' },
    { value: 'Northern Highway', name: 'Northern Highway' },
    { value: 'Orange Walk Town', name: 'Orange Walk Town' },
    { value: 'Palmar Village', name: 'Palmar Village' },
    { value: 'Punta Gorda', name: 'Punta Gorda' },
    { value: 'Ranchito Village', name: 'Ranchito Village' },
    { value: 'Roaring Creek', name: 'Roaring Creek' },
    { value: 'San Felipe Village', name: 'San Felipe Village' },
    { value: 'San Ignacio', name: 'San Ignacio' },
    { value: 'San Jose Village', name: 'San Jose Village' },
    { value: 'San Lazaro Village', name: 'San Lazaro Village' },
    { value: 'San Narciso Village', name: 'San Narciso Village' },
    { value: 'San Pablo Village', name: 'San Pablo Village' },
    { value: 'San Pedro', name: 'San Pedro' },
    { value: 'Santa Elena', name: 'Santa Elena' },
    { value: 'Sandhill Village', name: 'Sandhill Village' },
    { value: 'Scotland Halfmoon Village', name: 'Scotland Halfmoon Village' },
    { value: 'Shipyard', name: 'Shipyard' },
    { value: 'Trial Farm', name: 'Trial Farm' },
    { value: 'Trinidad Village', name: 'Trinidad Village' },
    { value: 'Western Highway', name: 'Western Highway' },
    { value: 'Yo Creek Village', name: 'Yo Creek Village' },
  ];
  children = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }];
  myForm: FormGroup;
  hobbies: any[] = [];
  hobbiesForm: FormGroup;
  hobbiesDataSource: any;

  // sand hill, August Pine Ridge,Double Head Cabbage, San Lazaro Village, libertad village, palmar village, santa rita,
  // TODO: add town and district
  constructor(
    private _service: EmployeeService,
    public snackBar: MatSnackBar,
    private fb: FormBuilder,
    private titleCasePipe: TitleCasePipe
  ) {}

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

  async onSubmit() {
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
      try {
        if (employeePersonal._id && employeePersonal._id.length > 0) {
          delete employeePersonal._id;
          await this._service.updatePersonal(employeePersonal).toPromise();
          this.hobbiesForm.reset();
        } else {
          delete employeePersonal._id;
          await this._service.savePersonal(employeePersonal).toPromise();
          this.hobbiesForm.reset();
        }
        return this.onSuccess.emit();
      } catch (e) {
        return this.onError.emit();
      }
    } else {
      this.myForm.markAllAsTouched();
    }
  }
}
