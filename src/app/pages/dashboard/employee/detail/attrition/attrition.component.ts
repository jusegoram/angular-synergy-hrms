import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Employee, EmployeeAttrition } from '@synergy-app/shared/models/employee/employee';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeService } from '@synergy-app/shared/services/employee.service';
import { SessionService } from '@synergy-app/shared/services/session.service';
import { OnDeleteAlertComponent } from '@synergy-app/shared/modals/on-delete-alert/on-delete-alert.component';
import { noop } from 'rxjs';

@Component({
  selector: 'attrition-info',
  templateUrl: './attrition.component.html',
  styleUrls: ['./attrition.component.scss'],
})
export class AttritionComponent implements OnInit, OnChanges {
  constructor(
    private _formBuilder: FormBuilder,
    private _service: EmployeeService,
    private _session: SessionService
  ) {
  }

  @Input() employee: Employee;
  @Input() authorization: any;
  @Output() onSuccess = new EventEmitter<any>();
  @Output() onError = new EventEmitter<any>();
  @ViewChild('onDeleteAlert', {static: false})
  onDeleteAlert: OnDeleteAlertComponent;
  dataSource: any;
  public isEdit: false;
  employeeAttrition: any;
  editAttritionId: string;
  userFullName: any;
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
    {value: 'Loss Jobs'},
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
  nameToSplit = (name: string) => {
    const split = name.split(' ');
    return split;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.employee) {
      this.dataSource = undefined;
      this.employeeAttrition = [...this.employee.attrition];
      this.populateTable(this.employeeAttrition);
    }
  }

  ngOnInit() {
    this.authorization.edit && this.authorization.create ? this.addActionColumn() : noop();
    this.employeeAttrition = this.employee.attrition;
    this.populateTable(this.employeeAttrition);
    this.buildForms();
  }

  addActionColumn() {
    this.displayedColumns.push('action');
  }

  buildForms() {
    this.userFullName = this.nameToSplit(this._session.getName());
    this.attritionForm = this._formBuilder.group({
      employee: [this.employee._id],
      reason1: ['', Validators.required],
      reason2: [''],
      comment: ['', Validators.required],
      commentDate: [new Date()],
      submittedBy: [{
        _id: this._session.getId(),
        firstName: this.userFullName[0],
        lastName: this.userFullName[this.userFullName.length - 1],
      }]
    });
  }

  populateTable(event: any) {
    this.dataSource = new MatTableDataSource(event);
  }

  async onSubmit() {
    const {value: form, valid, touched} = this.attritionForm;
    if (valid && touched) {
      const attrition: EmployeeAttrition = {
        ...form
      };
      try {
        await this._service.saveAttrition(attrition).toPromise();
        this.clearForm();
        return this.onSuccess.emit();
      } catch (e) {
        return this.onError.emit();
      }
    }
    return;
  }

  fireDelete(item) {
    return item.submittedBy._id === this._session.getId() ?
      this.onDeleteAlert.fire(item) :
      this.onError.emit();
  }

  async onDelete(item) {
    try {
      await this._service.deleteAttrition(item).toPromise();
      return this.onSuccess.emit();
    } catch (e) {
      return this.onError.emit();
    }
  }

  clearForm() {
    ['reason1', 'reason2', 'comment'].forEach(i => this.attritionForm.controls[i].reset());
  }
}
