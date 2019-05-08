import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EmployeeService } from '../../employee.service';
import { SessionService } from '../../../session/session.service';
import {Employee, EmployeePersonal} from '../../Employee';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import { MatSnackBar } from '@angular/material';
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
    { value: 'Commonlaw', name: 'Common Law' },
    { value: 'Divorced', name: 'Divorced' },
    { value: 'Widowed', name: 'Widowed' }];

    districts = [
      { value: 'Corozal', name: 'Corozal' },
      { value: 'Orange walk', name: 'Orange Walk' },
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
      { value: 'independence', name: 'Independence' },
      { value: 'Ladyville', name: 'Ladyville' },
      { value: 'Libertad Village', name: 'Libertad Village' },
      { value: 'Little belize', name: 'Little belize' },
      { value: 'Lords Bank', name: 'Lords Bank' },
      { value: 'Mahogany Heights', name: 'Mahogany Heights' },
      { value: 'Maskall Village', name: 'Maskall Village' },
      { value: 'Northern HW', name: 'Northern HW' },
      { value: 'Orange Walk', name: 'Orange Walk Town' },
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
      { value: 'san pedro', name: 'San Pedro' },
      { value: 'Santa Elena', name: 'Santa Elena' },
      { value: 'Sandhill Village', name: 'Sandhill Village' },
      { value: 'Scotland Halfmoon Village', name: 'Scotland Halfmoon Village'},
      { value: 'Shipyard', name: 'Shipyard' },
      { value: 'Trial Farm', name: 'Trial Farm' },
      { value: 'Trinidad Village', name: 'Trinidad Village' },
      { value: 'Western HW', name: 'Western HW' },
      { value: 'Yo Creek Village', name: 'Yo Creek Village' },
      ];
  myForm: FormGroup;
  public isAuth = false;
// sand hill, August Pine Ridge,Double Head Cabbage, San Lazaro Village, libertad village, palmar village, santa rita,
  ngOnChanges(changes: SimpleChanges) {
  }
// TO DO: add town and district
  constructor(private employeeService: EmployeeService, public snackBar: MatSnackBar, private fb: FormBuilder) {
    this.newPersonal = new EmployeePersonal(
      '', '', '', '',
      '', '', '' , null ,
      '' , '', null, '',
      '', '', null);
    }

  ngOnInit() {
    this.personal = this.employee.personal;
    if (!this.employee.personal) {
      this.personal = this.newPersonal;
      this.isNew = true;
    }
    this.buildForm(this.personal);
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
      birthPlaceDis: [arg.birthPlaceDis],
      birthPlaceTow: [arg.birthPlaceTow],
      maritalStatus: [arg.maritalStatus],
      address: [arg.address],
      town: [arg.town],
      district: [arg.district],
      addressDate: [arg.addressDate],
      celNumber: [arg.celNumber],
      telNumber: [arg.telNumber],
      emailAddress: [arg.emailAddress, Validators.email],
      emailDate: [arg.emailDate]
    });
  }
  onSubmit() {
    const employeePersonal = new EmployeePersonal(
      this.personal._id,
      this.employee.employeeId + '',
      this.employee._id,
      this.myForm.value.maritalStatus, // added to form
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
      this.myForm.value.emailDate
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
