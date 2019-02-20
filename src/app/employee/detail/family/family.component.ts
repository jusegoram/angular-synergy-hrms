import { Component, OnInit, Input } from '@angular/core';
import {Employee, EmployeeFamily} from '../../Employee';
import { MatSnackBar, MatTableDataSource } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EmployeeService } from '../../employee.service';

@Component({
  selector: 'family-info',
  templateUrl: './family.component.html',
  styleUrls: ['./family.component.css']
})
export class FamilyComponent implements OnInit {
  @Input() employee: Employee;
  @Input() authorization: boolean;
  public employeeFamily: any;
  public dataSource: any;
  public familyForm: FormGroup;
  public isEdit = false;
  displayedColumns = ['name', 'relationship', 'celNumber', 'telNumber', 'emailAddress', 'address', 'edit'];
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
      emailAddress: [''],
      address: ['']
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
        current.address);
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
        current.address);
        this.employeeService.updateFamily(ref).subscribe(data => {this.isEdit = false; this.clearForm();}, error => {});
    }
  }
}
