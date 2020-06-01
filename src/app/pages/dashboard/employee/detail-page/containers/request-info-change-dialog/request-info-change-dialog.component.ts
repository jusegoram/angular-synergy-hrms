import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, ValidationErrors, ValidatorFn, Validators, FormControl } from '@angular/forms';
import { EmployeeService } from '@synergy-app/core/services';
import { HrTracker } from '@synergy-app/shared/models';
import { CommonValidator } from '@synergy-app/shared/validators/common.validator';
@Component({
  selector: 'app-request-info-change-dialog',
  templateUrl: './request-info-change-dialog.component.html',
  styleUrls: ['./request-info-change-dialog.component.scss'],
})
export class RequestInfoChangeDialogComponent implements OnInit {
  requestInfoForm: FormGroup;
  infoTypeFieldsNames: Array<string> = ['mainInfo', 'companyInfo', 'personalInfo', 'positionInfo'];

  constructor(
    public dialogRef: MatDialogRef<RequestInfoChangeDialogComponent>,
    private employeeService: EmployeeService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.requestInfoForm = this.formBuilder.group({
      mainInfo: [false],
      companyInfo: [false],
      personalInfo: [false],
      positionInfo: [false],
      issueDescription: ['', [Validators.required, , CommonValidator.emptyFieldValidator]],
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
      return invalid ? {'Select at least one info type option': true} : null;
    };
  }

  async onProceedClick(formValues: any) {
    try {
      const { mainInfo, companyInfo, personalInfo, positionInfo, issueDescription } = formValues;
      const hrTracker: HrTracker = this.data.hrTracker;
      hrTracker.tracker = {
        infoChangeRequest: {
          mainInfo,
          companyInfo,
          personalInfo,
          positionInfo,
          reason: issueDescription,
        },
      };
      const response = await this.employeeService.saveTracker(hrTracker);
      this.dialogRef.close({
        state: true,
        message: 'Request info change send successfully',
      });
    } catch (error) {
      this.dialogRef.close({
        state: false,
        message: 'We couldn\'t send your request. Try again later.',
      });
    }
  }

  onCancelClick(): void {
    this.dialogRef.close({state: false, message: ''});
  }
}
