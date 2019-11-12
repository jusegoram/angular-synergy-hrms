import { Component, OnInit, Input } from '@angular/core';
import {Employee, EmployeeFamily} from '../../Employee';
import { MatSnackBar, MatTableDataSource } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../employee.service';

@Component({
  selector: 'family-info',
  templateUrl: './family.component.html',
  styleUrls: ['./family.component.css']
})
export class FamilyComponent implements OnInit {
  @Input() employee: Employee;
  @Input() authorization: any;
  public employeeFamily: any;
  public dataSource: any;
  public familyForm: FormGroup;
  public isEdit = false;
  public expandedComment = false;

  public familyRelationships = [
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
  displayedColumns = ['name', 'relationship', 'celNumber', 'telNumber', 'emailAddress', 'address', 'comment', 'edit'];
  editReferenceId: string;

  constructor(
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private employeeService: EmployeeService) { }

  ngOnInit() {
    this.employeeFamily = this.employee.family;
    this.populateTable(this.employeeFamily);
    this.buildForms();
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  buildForms() {
    this.familyForm = this.fb.group({
      name: [''],
      relationship: [''],
      celNumber: [''],
      telNumber: [''],
      emailAddress: ['', Validators.email],
      address: [''],
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
  clearForm() {
    this.familyForm.reset();
  }

  editReference(param: string) {
    const data: any = this.dataSource.data;
    const i = data.findIndex((res) => res._id === param);
    const ref = this.dataSource.data[i];
    this.editReferenceId = param;
    this.familyForm.controls['name'].setValue(ref.referenceName);
    this.familyForm.controls['relationship'].setValue(ref.relationship);
    this.familyForm.controls['celNumber'].setValue(ref.celNumber);
    this.familyForm.controls['telNumber'].setValue(ref.telNumber);
    this.familyForm.controls['emailAddress'].setValue(ref.emailAddress);
    this.familyForm.controls['address'].setValue(ref.address);
    this.familyForm.controls['comment'].setValue(ref.comment);
    this.isEdit = true;
  }
  onSubmit() {
    let current = this.familyForm.value;
    if (!this.isEdit) {
      let ref = new EmployeeFamily (
        '',
        this.employee.employeeId.toString(10),
        this.employee._id,
        current.name,
        current.relationship,
        current.celNumber,
        current.telNumber,
        current.emailAddress,
        current.address,
        current.comment);
        this.employeeService.saveFamily(ref).subscribe(data => {
          this.populateTable(data);
          this.clearForm();
        }, error => {});
    } else {
      let ref = new EmployeeFamily (
        this.editReferenceId,
        this.employee.employeeId.toString(10),
        this.employee._id,
        current.name,
        current.relationship,
        current.celNumber,
        current.telNumber,
        current.emailAddress,
        current.address,
        current.comment);
        this.employeeService.updateFamily(ref).subscribe(data => {this.isEdit = false; this.clearForm();}, error => {});
    }
  }

  onExpandComment(){
    this.expandedComment = ! this.expandedComment;
  }
}
