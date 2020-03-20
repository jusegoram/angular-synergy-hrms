import { TitleCasePipe } from '@angular/common';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EmployeeService } from '../../employee.service';
import { SessionService } from '../../../session/session.service';
import {Employee, EmployeePersonal} from '../../Employee';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Params, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'personal-info',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit, OnChanges {
  userId: string;
  @Input() employee: Employee;
  @Input() authorization: any;
  isNew = false;
  personal: any;
  newPersonal: any;
  marStatus = [
    { value: 'Single', name: 'Single' },
    { value: 'Married', name: 'Married/Remarried' },
    { value: 'Separated', name: 'Separated' },
    { value: 'Common Law', name: 'Common Law' },
    { value: 'Divorced', name: 'Divorced' },
    { value: 'Widowed', name: 'Widowed' }];

    districts = [
      { value: 'Corozal', name: 'Corozal' },
      { value: 'Orange Walk', name: 'Orange Walk' },
      { value: 'Belize', name: 'Belize' },
      { value: 'Belmopan', name: 'Belmopan' },
      { value: 'Cayo', name: 'Cayo' },
      { value: 'Stann Creek', name: 'Stann Creek' },
      { value: 'Toledo', name: 'Toledo' }];

    towns = [
      {value: 'August Pine Ridge', name: 'August Pine Ridge'},
      { value: 'Belize City', name: 'Belize City' },
      { value: 'Bella Vista', name: 'Bella Vista' },
      { value: 'Belmopan', name: 'Belmopan' },
      { value: 'Benque Viejo', name: 'Benque Viejo' },
      { value: 'Biscayne Village', name: 'Biscayne Village' },
      { value: 'Boston Village', name: 'Boston Village'},
      { value: 'Burrell Boom', name: 'Burrell Boom' },
      { value: 'Camalote', name: 'Camalote' },
      { value: 'Carmelita', name: 'Carmelita'},
      { value: 'Concepcion Village', name: 'Concepcion Village'},
      { value: 'Corozal Town', name: 'Corozal Town' },
      { value: 'Cotton Tree Village', name: 'Cotton Tree Village'},
      { value: 'Crooked Tree', name: 'Crooked Tree'},
      { value: 'Dangriga', name: 'Dangriga' },
      { value: 'Double Head Cabbage', name: 'Double Head Cabbage'},
      { value: 'Gardenia Village', name: 'Gardenia Village'},
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
      { value: 'Palmar Village', name: 'Palmar Village'},
      { value: 'Punta Gorda', name: 'Punta Gorda' },
      { value: 'Ranchito Village', name: 'Ranchito Village'},
      { value: 'Roaring Creek', name: 'Roaring Creek' },
      { value: 'San Felipe Village', name: 'San Felipe Village' },
      { value: 'San Ignacio', name: 'San Ignacio' },
      { value: 'San Jose Village', name: 'San Jose Village' },
      { value: 'San Lazaro Village', name: 'San Lazaro Village'},
      { value: 'San Narciso Village', name: 'San Narciso Village' },
      { value: 'San Pablo Village', name: 'San Pablo Village' },
      { value: 'San Pedro', name: 'San Pedro' },
      { value: 'Santa Elena', name: 'Santa Elena' },
      { value: 'Sandhill Village', name: 'Sandhill Village' },
      { value: 'Scotland Halfmoon Village', name: 'Scotland Halfmoon Village'},
      { value: 'Shipyard', name: 'Shipyard' },
      { value: 'Trial Farm', name: 'Trial Farm' },
      { value: 'Trinidad Village', name: 'Trinidad Village' },
      { value: 'Western Highway', name: 'Western Highway' },
      { value: 'Yo Creek Village', name: 'Yo Creek Village' },
      ];
  children = [{id: 0}, {id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}, {id: 6}];
  myForm: FormGroup;
  hobbies: any[] = [];
  hobbiesForm: FormGroup;
  hobbiesDataSource: any;

  public isAuth = false;
// sand hill, August Pine Ridge,Double Head Cabbage, San Lazaro Village, libertad village, palmar village, santa rita,
  ngOnChanges(changes: SimpleChanges) {
  }
// TO DO: add town and district
  constructor(private employeeService: EmployeeService, public snackBar: MatSnackBar, private fb: FormBuilder, private titlecasePipe: TitleCasePipe) {
    this.newPersonal = new EmployeePersonal(
      '', '', '', '', 0,
      '', '', '' , null ,
      '' , '', null, '',
      '', '', null, []);
    }

  ngOnInit() {
    this.personal = this.employee.personal;
    this.hobbies = this.personal ? this.personal.hobbies : [];
    if (!this.employee.personal) {
      this.personal = this.newPersonal;
      this.isNew = true;
    }
    this.buildForm(this.personal);
    this.buildHobbiesForm();
    this.buildHobbiesTable(this.personal.hobbies);
  }
  // public isAuthorized(): boolean {
  //   this.sessionService.getRole().subscribe(
  //     (result: number) => {
  //       if (result === 1 || result === 4) {
  //         this.isAuth = true;
  //         return true;
  //       }
  //     });
  //       this.isAuth = false;
  //       return false;
  // }
  // loadInfo() {
  //   this.employeeService.getPersonal(this.employeeId).subscribe(
  //     (employeePersonal) => {
  //      this.dataSource = employeePersonal;
  //      if (typeof this.dataSource === 'undefined') {
  //        this.isNew = true;
  //        this.dataSource = new EmployeePersonal('new', '', '', '', '', '', '', '', '', '', new Date()  , '' , '', '', '');
  //      }
  //   });
  // }
  buildForm(arg: any) {
    this.myForm = this.fb.group({
      birthDate: [arg.birthDate],
      birthPlaceDis: [this.titlecasePipe.transform(arg.birthPlaceDis)],
      birthPlaceTow: [this.titlecasePipe.transform(arg.birthPlaceTow)],
      maritalStatus: [this.titlecasePipe.transform(arg.maritalStatus)],
      amountOfChildren: [arg.amountOfChildren ? arg.amountOfChildren : 0],
      address: [this.titlecasePipe.transform(arg.address)],
      town: [this.titlecasePipe.transform(arg.town)],
      district: [this.titlecasePipe.transform(arg.district)],
      addressDate: [arg.addressDate],
      celNumber: [arg.celNumber],
      telNumber: [arg.telNumber],
      emailAddress: [arg.emailAddress, Validators.email],
      emailDate: [arg.emailDate]
    });
  }

  buildHobbiesForm() {
    this.hobbiesForm = this.fb.group({
      hobbyTitle: [''],
      hobbyComment: ['']
    });
  }

  buildHobbiesTable(hobbies) {
    this.hobbiesDataSource = new MatTableDataSource(hobbies);
  }

  onAddHobby() {
    const values = this.hobbiesForm.value;
    this.hobbies.push({hobbyTitle: values.hobbyTitle, hobbyComment: values.hobbyComment });
    this.buildHobbiesTable(this.hobbies);
    this.onSubmit();
  }
  onSubmit() {
    this.hobbiesForm.reset();
    const employeePersonal = new EmployeePersonal(
      this.personal._id,
      this.employee.employeeId + '',
      this.employee._id,
      this.myForm.value.maritalStatus, // added to form
      this.myForm.value.amountOfChildren,
      this.myForm.value.address,
      this.myForm.value.town, // added to form
      this.myForm.value.district, // added to form
      this.myForm.value.addressDate,
      this.myForm.value.celNumber,
      this.myForm.value.telNumber,
      this.myForm.value.birthDate, // add to form
      this.myForm.value.birthPlaceDis,
      this.myForm.value.birthPlaceTow, // add to form
      this.myForm.value.emailAddress,
      this.myForm.value.emailDate,
      this.hobbies,
    );

    if (this.isNew) {
      this.employeeService.savePersonal(employeePersonal).subscribe(
        data => {
          this.snackBar.open('Employee information saved successfully', 'Thank you', {
            duration: 2000,
          });
        },
        error => {
          this.snackBar.open('Error saving information, please try again or notify the IT department', 'Try again', {
            duration: 2000,
          });
        }
      );
    } else {
      this.employeeService.updatePersonal(employeePersonal).subscribe(
        data => {
          this.snackBar.open('Employee information updated successfully', 'Thank you', {
            duration: 2000,
          });
        },
        error => {
          this.snackBar.open('Error updating information, please try again or notify the IT department', 'Try again', {
            duration: 2000,
          });
        }
      );
    }
  }
}
