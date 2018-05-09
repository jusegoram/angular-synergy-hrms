import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { SessionService } from '../../../session/services/session.service';
import { MatSnackBar } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { EmployeePayroll } from '../../services/models/employee-models';
import { Params, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'payroll-info',
  templateUrl: './payroll.component.html',
  styleUrls: ['./payroll.component.scss']
})
export class PayrollComponent implements OnInit {
  userId: string;
  @Input() employeeId: string;
  @Input() 
  @Input() authorization: boolean;
  public isAuth = false;
  public dataSource: EmployeePayroll;
  payrollForm: FormGroup;
  isNew = false;
  currentEmployee:any;
  currentPosition:any;
  payrollTypes = [
    { value: 'semimonthly', name: 'Semimonthly' },
    { value: 'biweekly', name: 'Biweekly' },
  ];


  constructor(private employeeService: EmployeeService,
    private sessionService: SessionService,
    public snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,) {
  }

  ngOnChanges(changes: SimpleChanges) {
    
    if (this.employeeId !== "" && changes['employeeId']) {
      this.loadInfo();
    }
  }
  ngOnInit() {
    this.isAuthorized();
    this.payrollForm = new FormGroup({
      socialSecurity: new FormControl(),
      TIN: new FormControl(),
      positionid: new FormControl(),
      payrollType: new FormControl(),
      bankName: new FormControl(),
      bankAccount: new FormControl(),
      billable: new FormControl()
    });
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.userId = params['id'];
    });
  }

  loadInfo() {
    this.employeeService.getPayroll(this.employeeId).subscribe(
      (employeePayroll: EmployeePayroll[]) => {
        this.dataSource = employeePayroll[0]; 
         if(typeof(this.dataSource) === 'undefined'){
           this.isNew = true;
           this.dataSource = new EmployeePayroll("new","", "", "", "", "", "", "", null);
          }else{
            this.isNew = false;
          }
      });
      this.employeeService.getCurrentPosition(this.employeeId).subscribe((result) => {
        this.currentPosition = result;
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
  onSubmit() {
    const employeePayroll = new EmployeePayroll(
      this.dataSource.id,
      this.employeeId,
      this.userId,
      this.payrollForm.value.TIN,
      this.payrollForm.value.positionid,
      this.payrollForm.value.payrollType,
      this.payrollForm.value.bankName,
      this.payrollForm.value.bankAccount,
      this.payrollForm.value.billable,
    );
   
    if (this.isNew) {
      this.employeeService.savePayroll(employeePayroll).subscribe(
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
      this.employeeService.updatePayroll(employeePayroll).subscribe(
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
