import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from '../../../session/services/session.service';
import { EmployeePersonal } from '../../services/models/employee-models';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'personal-info',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent implements OnInit, OnChanges {
  @Input() employeeId: string;
  @Input() authorization: boolean;
  ngOnChanges(changes: SimpleChanges) {
    if (this.employeeId != null && changes['employeeId']) {
      this.loadInfo();
    }
  }
  public dataSource: EmployeePersonal;

  constructor(private employeeService: EmployeeService, 
              private activatedRoute: ActivatedRoute, 
              private sessionService: SessionService,
              public snackBar: MatSnackBar) { }
  myForm: FormGroup;
  public isAuth = false;
  ngOnInit() {
    this.isAuthorized();
    this.myForm = new FormGroup({
      address: new FormControl(),
      addressDate: new FormControl(),
      celNumber: new FormControl(),
      telNumber: new FormControl(),
      emailAddress: new FormControl(),
      emailDate: new FormControl()
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
    });
  }
  
  onSubmit(){
    const employeePersonal= new EmployeePersonal(
      this.dataSource.id,
      this.employeeId,
      this.myForm.value.address,
      this.myForm.value.addressDate,
      this.myForm.value.celNumber,
      this.myForm.value.telNumber,
      this.myForm.value.emailAddress,
      this.myForm.value.emailDate
    );
    this.employeeService.updatePersonal(employeePersonal).subscribe(
        data => {this.snackBar.open('Employee information updated successfully', 'Thank you', {
          duration: 2000,
        });
      },
        error => {this.snackBar.open('Error updating information, please try again or notify the IT department', 'Try again' , {
          duration: 2000,
        });
      }
    );
  }
}
