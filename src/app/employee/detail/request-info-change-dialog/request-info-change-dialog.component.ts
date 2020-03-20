import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup, FormBuilder, ValidationErrors, ValidatorFn, Validators, FormControl } from '@angular/forms';
@Component({
  selector: 'app-request-info-change-dialog',
  templateUrl: './request-info-change-dialog.component.html',
  styleUrls: ['./request-info-change-dialog.component.scss']
})
export class RequestInfoChangeDialogComponent implements OnInit {

  requestInfoForm: FormGroup;
  infoTypeFieldsNames: Array<string> = [
    'mainInfo',
    'companyInfo',
    'personalInfo',
    'positionInfo'
  ];


  constructor( public dialogRef: MatDialogRef<RequestInfoChangeDialogComponent>, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.requestInfoForm = this.formBuilder.group({
      mainInfo: [false],
      companyInfo: [false],
      personalInfo: [false],
      positionInfo: [false],
      issueDescription: ['', [Validators.required, this.emptyFieldValidator]]
    });

    this.requestInfoForm.setValidators(this.infoTypeFieldsValidator());

  }

  get issueDescriptionHasError() {
    return this.requestInfoForm.get('issueDescription').invalid;
  }

  infoTypeFieldsValidator(): ValidatorFn {
    return (formGroup: FormGroup): ValidationErrors => {
      let invalid = true;
      this.infoTypeFieldsNames.forEach((infoTypeFieldsName: string) => {
        if (formGroup.get(infoTypeFieldsName).value) {
          invalid = false;
        }
      });
      return (invalid ? {'Select at least one info type option': true} : null);
    };
  }

  emptyFieldValidator(control: FormControl): any {
      if (! control.value.trim()) { return {'field should not be empty': true}; }
      return null;
  }

  onProceedClick(): void {
    this.dialogRef.close(true);
  }
  onCancelClick(): void {
    this.dialogRef.close();
  }

}





