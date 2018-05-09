import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { SessionService } from '../../../session/services/session.service';
import { EmployeePersonal } from '../../services/models/employee-models';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Params, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'personal-info',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit, OnChanges {
  userId: string;
  @Input() employeeId: string;
  @Input() authorization: boolean;
  isNew = false;
  
  marStatus = [
    { value: 'single', name: 'Single' },
    { value: 'married', name: 'Married/Remarried' },
    { value: 'separated', name: 'Separated' },
    { value: 'commonlaw', name: 'Common Law' },
    { value: 'divorced', name: 'Divorced' },
    { value: 'widowed', name: 'Widowed' }];

    districts = [
      { value: 'corozal', name: 'Corozal' },
      { value: 'orange walk', name: 'Orange Walk' },
      { value: 'belize', name: 'Belize' },
      { value: 'cayo', name: 'Cayo' },
      { value: 'stann creek', name: 'Stann Creek' },
      { value: 'toledo', name: 'Toledo' }];

    towns = [
      { value: 'belize city', name: 'Belize City' },
      { value: 'bella vista', name: 'Bella Vista' },
      { value: 'belmopan', name: 'Belmopan' },
      { value: 'benque viejo', name: 'Benque Viejo' },
      { value: 'camalote', name: 'Camalote' },
      { value: 'corozal', name: 'Corozal' },
      { value: 'dangriga', name: 'Dangriga' },
      { value: 'guinea grass', name: 'Guinea Grass' },
      { value: 'independence', name: 'Independence' },
      { value: 'ladyville', name: 'Ladyville' },
      { value: 'little belize', name: 'Little belize' },
      { value: 'lords bank', name: 'Lords Bank' },
      { value: 'orange walk', name: 'Orange Walk Town' },
      { value: 'punta gorda', name: 'Punta Gorda' },
      { value: 'san ignacio', name: 'San Ignacio' },
      { value: 'san jose', name: 'San Jose' },
      { value: 'san narciso', name: 'San Narciso' },
      { value: 'san pedro', name: 'San Pedro' },
      { value: 'shipyard', name: 'Shipyard' },
      { value: 'trial farm', name: 'Trial Farm' }];
    

  ngOnChanges(changes: SimpleChanges) {
    if (this.employeeId !== null && changes['employeeId']) {
      this.loadInfo();
      
    }
  }
  public dataSource: EmployeePersonal;
//TO DO: add town and district
  constructor(private employeeService: EmployeeService, 
              private sessionService: SessionService,
              public snackBar: MatSnackBar,
              private activatedRoute: ActivatedRoute,) {
               }
  myForm: FormGroup;
  public isAuth = false;
  ngOnInit() {
    this.isAuthorized();
    this.myForm = new FormGroup({
      birthDate: new FormControl(),
      birthPlaceDis: new FormControl(),
      birthPlaceTow: new FormControl(),
      maritalStatus: new FormControl(),
      address: new FormControl(),
      town: new FormControl(),
      district: new FormControl(),
      addressDate: new FormControl(),
      celNumber: new FormControl(),
      telNumber: new FormControl(),
      emailAddress: new FormControl(),
      emailDate: new FormControl()
    });

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.userId = params['id'];
    });
  }
  public isAuthorized(): boolean {
    this.sessionService.getRole().subscribe(
      (result: number) => {
        if (result === 1 || result === 4) {
          this.isAuth = true;
          return true;
        }
      });
        this.isAuth = false;
        return false;
  }
  loadInfo(){
    this.employeeService.getPersonal(this.employeeId).subscribe(
      (employeePersonal:EmployeePersonal[]) => {
       this.dataSource = employeePersonal[0];
       if(typeof this.dataSource === 'undefined'){
         this.isNew = true;
         this.dataSource = new EmployeePersonal("new","","","","","","","","","", new Date()  ,"" ,"","","");
       }
    });
  }
  
  onSubmit(){ 
    const employeePersonal= new EmployeePersonal(
      this.dataSource.id,
      this.employeeId,
      this.userId,
      this.myForm.value.maritalStatus, //added to form
      this.myForm.value.address,
      this.myForm.value.town,//added to form
      this.myForm.value.district,//added to form
      this.myForm.value.addressDate,
      this.myForm.value.celNumber,
      this.myForm.value.telNumber,
      this.myForm.value.birthDate,//add to form
      this.myForm.value.birthPlaceDis,
      this.myForm.value.birthPlaceTow,//add to form
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
