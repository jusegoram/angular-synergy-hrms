import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Employee, EmployeeFamily } from '@synergy-app/shared/models';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OnDeleteAlertComponent } from '@synergy-app/shared/modals';
import { noop } from 'rxjs';
import { SOCIAL } from '@synergy/environments';

@Component({
  selector: 'app-family-info',
  templateUrl: './family.component.html',
  styleUrls: ['./family.component.css'],
})
export class FamilyComponent implements OnInit, OnChanges {
  @Input() employee: Employee;
  @Input() authorization: any;
  @Output() onError = new EventEmitter<any>();
  @Output() onSubmitButtonClicked = new EventEmitter<EmployeeFamily>();
  @Output() onDeleteConfirmation = new EventEmitter<EmployeeFamily>();
  @ViewChild('onDeleteAlert', { static: false })
  onDeleteAlert: OnDeleteAlertComponent;
  public employeeFamily: any;
  public dataSource: any;
  public familyForm: FormGroup;
  public isEdit = false;
  public expandedComment = false;
  public familyRelationships = SOCIAL.FAMILY_RELATIONSHIPS;
  displayedColumns = [
    'emergencyContact',
    'name',
    'relationship',
    'birthDate',
    'celNumber',
    'telNumber',
    'emailAddress',
    'address',
    'comment',
  ];

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.employee) {
      this.dataSource = undefined;
      this.employeeFamily = [...this.employee.family];
      this.populateTable(this.employeeFamily);
    }
  }

  ngOnInit() {
    this.authorization.edit && this.authorization.create ? this.addActionColumn() : noop();
    this.employeeFamily = [...this.employee.family];
    this.populateTable(this.employeeFamily);
    this.buildForms();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  addActionColumn() {
    this.displayedColumns.push('action');
  }

  buildForms() {
    this.familyForm = this.fb.group({
      employee: [this.employee._id],
      referenceName: ['', Validators.required],
      relationship: ['', Validators.required],
      birthDate: [''],
      celNumber: [''],
      telNumber: [''],
      emailAddress: ['', Validators.email],
      address: ['', Validators.required],
      emergencyContact: [false],
      comment: [''],
    });
  }

  populateTable(event: any) {
    this.dataSource = new MatTableDataSource(event);
  }

  clearForm() {
    this.buildForms();
  }

  onSubmit() {
    if (this.familyForm.valid && this.familyForm.touched) {
      const current = this.familyForm.value;
      const family: EmployeeFamily = {
        ...current,
      };
      this.onSubmitButtonClicked.emit(family);
      this.clearForm();
    } else {
      this.familyForm.markAllAsTouched();
    }
  }

  onDelete(item) {
    this.onDeleteConfirmation.emit(item);
  }

  fireDelete(item) {
    this.onDeleteAlert.fire(item);
  }

  onExpandComment() {
    this.expandedComment = !this.expandedComment;
  }
}
