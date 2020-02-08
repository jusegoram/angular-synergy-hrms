import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { EmployeeService } from './../../employee.service';
import { Component, Inject, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { SignatureFieldComponent } from '../../../shared/signature-field/signature-field.component';

@Component({
  selector: 'app-status-dialog',
  templateUrl: './status-dialog.component.html',
  styleUrls: ['./status-dialog.component.scss']
})
export class StatusDialogComponent implements AfterViewInit {
  @ViewChildren(SignatureFieldComponent)  public signatures: QueryList<SignatureFieldComponent>;
  supervisor = 0;
  manager = 1;
  form: FormGroup;
  status: any[];
  statusControl: FormControl;
  constructor(
    public dialogRef: MatDialogRef<StatusDialogComponent>,
    private _employeeService: EmployeeService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.statusControl = new FormControl('', Validators.required);
    this.status = this._employeeService.status;
    this.form = fb.group({
      supervisorSignature: ['', Validators.required],
      managerSignature: ['', Validators.required],
    });
  }

  ngAfterViewInit() {
  }


  onCancelClick(){}
  onProceedClick(){}
}
