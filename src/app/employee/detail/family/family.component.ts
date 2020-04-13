import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {Employee, EmployeeFamily} from '../../../shared/models/employee/employee';
import {MatTableDataSource} from '@angular/material/table';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EmployeeService} from '../../employee.service';
import {OnDeleteAlertComponent} from '../../../shared/modals/on-delete-alert/on-delete-alert.component';
import {noop} from 'rxjs';

@Component({
  selector: 'family-info',
  templateUrl: './family.component.html',
  styleUrls: ['./family.component.css'],
})
export class FamilyComponent implements OnInit, OnChanges {
  @Input() employee: Employee;
  @Input() authorization: any;
  @Output() onSuccess = new EventEmitter<any>();
  @Output() onError = new EventEmitter<any>();
  @ViewChild('onDeleteAlert', {static: false})
  onDeleteAlert: OnDeleteAlertComponent;
  public employeeFamily: any;
  public dataSource: any;
  public familyForm: FormGroup;
  public isEdit = false;
  public expandedComment = false;

  public familyRelationships = [
    {value: 'Partner', viewValue: 'Partner'},
    {value: 'Son', viewValue: 'Son'},
    {value: 'Daughter', viewValue: 'Daughter'},
    {value: 'Son-in-law', viewValue: 'Son-in-law'},
    {value: 'Daughter-in-law', viewValue: 'Daughter-in-law'},
    {value: 'Niece', viewValue: 'Niece'},
    {value: 'Nephew', viewValue: 'Nephew'},
    {value: 'Cousin', viewValue: 'Cousin'},
    {value: 'Cousin’s husband', viewValue: 'Cousin’s husband'},
    {value: 'Cousin’s wife', viewValue: 'Cousin’s wife'},
    {value: 'Wife', viewValue: 'Wife'},
    {value: 'Husband', viewValue: 'Husband'},
    {value: 'Brother', viewValue: 'Brother'},
    {value: 'Sister', viewValue: 'Sister'},
    {value: 'Brother-in-law', viewValue: 'Brother-in-law'},
    {value: 'Sister-in-law', viewValue: 'Sister-in-law'},
    {value: 'Father', viewValue: 'Father'},
    {value: 'Mother', viewValue: 'Mother'},
    {value: 'Uncle', viewValue: 'Uncle'},
    {value: 'Aunt', viewValue: 'Aunt'},
    {value: 'Great-uncle', viewValue: 'Great-uncle'},
    {value: 'Great-aunt', viewValue: 'Great-aunt'},
    {value: 'Grandmother', viewValue: 'Grandmother'},
    {value: 'Grandfather', viewValue: 'Grandfather'},
    {value: 'Friend', viewValue: 'Friend'},
  ];
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

  constructor(
    private fb: FormBuilder,
    private _service: EmployeeService
  ) {
  }

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

  async onSubmit() {
    if (this.familyForm.valid && this.familyForm.touched) {
      const current = this.familyForm.value;
      const family: EmployeeFamily = {
        ...current
      };
      try {
        await this._service.saveFamily(family).toPromise();
        this.clearForm();
        return this.onSuccess.emit();
      } catch (e) {
        console.log(e);
        return this.onError.emit();
      }
    } else {
      this.familyForm.markAllAsTouched();
    }
  }

  async onDelete(item) {
    try {
      await this._service.deleteFamily(item).toPromise();
      return this.onSuccess.emit();
    } catch (e) {
      return this.onError.emit();
    }
  }

  fireDelete(item) {
    this.onDeleteAlert.fire(item);
  }

  onExpandComment() {
    this.expandedComment = !this.expandedComment;
  }
}
