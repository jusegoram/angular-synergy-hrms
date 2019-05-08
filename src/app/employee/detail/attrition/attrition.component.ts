import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Employee, EmployeeAttrition } from '../../Employee';
import { MatSnackBar, MatTableDataSource } from '@angular/material';
import { EmployeeService } from '../../employee.service';
import { SessionService } from '../../../session/session.service';

@Component({
  selector: 'attrition-info',
  templateUrl: './attrition.component.html',
  styleUrls: ['./attrition.component.scss']
})
export class AttritionComponent implements OnInit {
  @Input() employee: Employee;
  @Input() authorization: any;
  dataSource: any;
  public isEdit: false;
  employeeAttrition: any;
  editAttritionId: string;
  editAttritionDate: Date;
  reasons = [
    {value: 'Absenteeism'},
    {value: 'Baby Sitter issues'},
    {value: 'Bad Adherence'},
    {value: 'Bad Attendance'},
    {value: 'Bad Attitude Issues'},
    {value: 'Client Request'},
    {value: 'Did Not Return From Leave'},
    {value: 'Education Plans'},
    {value: 'Failed Assestment Test'},
    {value: 'Family Issues'},
    {value: 'Fraud'},
    {value: 'Going Back To School'},
    {value: 'Got Another Job'},
    {value: 'Gross Misconduct'},
    {value: 'Health/Medical Issues'},
    {value: 'Job Abandonment'},
    {value: 'Job Too Stressful'},
    {value: 'Lack Supervisor Assistance'},
    {value: 'Low Conversion Rate'},
    {value: 'Low Productivity'},
    {value: 'Low QA Scores'},
    {value: 'Low Salary'},
    {value: 'Misconduct'},
    {value: 'Moved to Another City/Town'},
    {value: 'Negligence Of Duty'},
    {value: 'Not Certified From PIP'},
    {value: 'Not Certified From Training'},
    {value: 'Pay Issues'},
    {value: 'PCI Violation'},
    {value: 'Personal Reasons'},
    {value: 'Procedures'},
    {value: 'Prohibited Site'},
    {value: 'Protocol Compliance'},
    {value: 'Redundancy'},
    {value: 'Schedule Preference'},
    {value: 'Tardines'},
    {value: 'Theft'},
    {value: 'Traveling Issues'},
    {value: 'Traveling Out Of the Country'},
    {value: 'Walked Off The Job'},
    {value: 'Work Avoidance'},
  ];
  displayedColumns = ['reason', 'secondaryReason', 'comment', 'by', 'date'];
  public attritionForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private employeeService: EmployeeService,
    private sessionService: SessionService) { }


  ngOnInit() {
    this.employeeAttrition = this.employee.attrition;
    this.populateTable(this.employeeAttrition);
    this.buildForms();
  }
  buildForms() {
    this.attritionForm = this.fb.group({
      primaryReason: [''],
      secondaryReason: [''],
      comment: ['']
    });
  }
  populateTable(event: any) {
    if (this.dataSource) {
      const data = this.dataSource.data;
      data.push(event);
      this.dataSource.data = data;
    } else { this.dataSource = new MatTableDataSource(event); }
  }
  onSubmit() {
    const current = this.attritionForm.value;
    const user = this.sessionService.getId();
    if (!this.isEdit) {
      const com = new EmployeeAttrition(
        '',
        this.employee.employeeId.toString(10),
        current.primaryReason,
        current.secondaryReason,
        current.comment,
        new Date(),
        user,
        this.employee._id );
      this.employeeService.saveAttrition(com).subscribe(data => {
        this.populateTable(data);
      }, error => {});
    }else {
      const com = new EmployeeAttrition(
        this.editAttritionId,
        this.employee.employeeId.toString(10),
        current.primaryReason,
        current.secondaryReason,
        current.comment,
        this.editAttritionDate,
        user,
        this.employee._id
    );
     this.employeeService.saveAttrition(com).subscribe(data => {}, error => {});
    }

  }
  clearForm() {
    this.attritionForm.reset();
  }
}
