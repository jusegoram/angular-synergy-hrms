import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Employee, EmployeeAttrition } from '@synergy-app/shared/models';
import { MatTableDataSource } from '@angular/material/table';
import { OnDeleteAlertComponent } from '@synergy-app/shared/modals';
import { noop } from 'rxjs';

@Component({
  selector: 'app-attrition-info',
  templateUrl: './attrition.component.html',
  styleUrls: ['./attrition.component.scss'],
})
export class AttritionComponent implements OnInit, OnChanges {
  @Input() currentUser: any;
  @Input() employee: Employee;
  @Input() authorization: any;
  @Output() onError = new EventEmitter<any>();
  @Output() onSubmitButtonClicked = new EventEmitter<EmployeeAttrition>();
  @Output() onDeleteConfirmation = new EventEmitter<EmployeeAttrition>();
  @ViewChild('onDeleteAlert', { static: false })
  onDeleteAlert: OnDeleteAlertComponent;
  dataSource: any;
  public isEdit: false;
  employeeAttrition: any;
  editAttritionId: string;
  userFullName: any;
  editAttritionDate: Date;
  reasons = [
    { value: 'Absenteeism' },
    { value: 'Baby Sitter issues' },
    { value: 'Bad Adherence' },
    { value: 'Bad Attendance' },
    { value: 'Bad Attitude Issues' },
    { value: 'Client Request' },
    { value: 'Did Not Return From Leave' },
    { value: 'Education Plans' },
    { value: 'Failed Assestment Test' },
    { value: 'Family Issues' },
    { value: 'Fraud' },
    { value: 'Going Back To School' },
    { value: 'Got Another Job' },
    { value: 'Gross Misconduct' },
    { value: 'Health/Medical Issues' },
    { value: 'Job Abandonment' },
    { value: 'Job Too Stressful' },
    { value: 'Lack Supervisor Assistance' },
    { value: 'Loss Jobs' },
    { value: 'Low Conversion Rate' },
    { value: 'Low Productivity' },
    { value: 'Low QA Scores' },
    { value: 'Low Salary' },
    { value: 'Misconduct' },
    { value: 'Moved to Another City/Town' },
    { value: 'Negligence Of Duty' },
    { value: 'Not Certified From PIP' },
    { value: 'Not Certified From Training' },
    { value: 'Pay Issues' },
    { value: 'PCI Violation' },
    { value: 'Personal Reasons' },
    { value: 'Procedures' },
    { value: 'Prohibited Site' },
    { value: 'Protocol Compliance' },
    { value: 'Redundancy' },
    { value: 'Schedule Preference' },
    { value: 'Tardines' },
    { value: 'Theft' },
    { value: 'Traveling Issues' },
    { value: 'Traveling Out Of the Country' },
    { value: 'Walked Off The Job' },
    { value: 'Work Avoidance' },
  ];
  displayedColumns = ['reason', 'secondaryReason', 'comment', 'by', 'date'];
  public attritionForm: FormGroup;

  constructor(private _formBuilder: FormBuilder) {}

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
    const { _id, firstName, lastName } = this.currentUser;
    this.attritionForm = this._formBuilder.group({
      employee: [this.employee._id],
      reason1: ['', Validators.required],
      reason2: [''],
      comment: ['', Validators.required],
      commentDate: [new Date()],
      submittedBy: [
        {
          _id,
          firstName,
          lastName,
        },
      ],
    });
  }

  populateTable(event: any) {
    this.dataSource = new MatTableDataSource(event);
  }

  async onSubmit() {
    const { value: form, valid, touched } = this.attritionForm;
    if (valid && touched) {
      const attrition: EmployeeAttrition = {
        ...form,
      };
      this.onSubmitButtonClicked.emit(attrition);
      this.clearForm();
    }
    return;
  }

  fireDelete(item) {
    return item.submittedBy._id === this.currentUser._id ? this.onDeleteAlert.fire(item) : this.onError.emit();
  }

  onDelete(item) {
    this.onDeleteConfirmation.emit(item);
  }

  clearForm() {
    ['reason1', 'reason2', 'comment'].forEach((i) => this.attritionForm.controls[i].reset());
  }
}
