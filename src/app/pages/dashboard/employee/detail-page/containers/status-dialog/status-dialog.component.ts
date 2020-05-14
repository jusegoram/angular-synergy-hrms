import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '@synergy-app/core/services';
import { AfterViewInit, Component, Inject, QueryList, ViewChildren } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SignatureFieldComponent } from '@synergy-app/shared/components';
import { HrTracker } from '@synergy-app/shared/models';
import { CommonValidator } from '@synergy-app/shared/validators/common.validator';
import moment from 'moment';

@Component({
  selector: 'app-status-dialog',
  templateUrl: './status-dialog.component.html',
  styleUrls: ['./status-dialog.component.scss'],
})
export class StatusDialogComponent implements AfterViewInit {
  @ViewChildren(SignatureFieldComponent) public signatures: QueryList<SignatureFieldComponent>;
  supervisor = 0;
  manager = 1;
  statusForm: FormGroup;
  status: any[];
  statusControl: FormControl;
  statusAbsenteeismForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<StatusDialogComponent>,
    private _employeeService: EmployeeService,
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const today = moment().toDate();
    const currentTime = moment().format('HH:mm');
    this.statusControl = new FormControl('', Validators.required);
    this.status = this._employeeService.status;
    this.statusForm = fb.group({
      effectiveDate: [today, Validators.required],
      supervisorSignature: ['', Validators.required],
      managerSignature: ['', Validators.required],
      reason: [''],
      absenteeism: [false],
    });

    this.statusAbsenteeismForm = fb.group({
      firstChance: fb.group({
        date: [today, Validators.required],
        time: [currentTime, Validators.required],
        reason: ['', [Validators.required, CommonValidator.emptyFieldValidator]],
      }),
      secondChance: fb.group({
        date: [today, Validators.required],
        time: [currentTime, Validators.required],
        reason: ['', [Validators.required, CommonValidator.emptyFieldValidator]],
      }),
      thirdChance: fb.group({
        date: [today, Validators.required],
        time: [currentTime, Validators.required],
        reason: ['', [Validators.required, CommonValidator.emptyFieldValidator]],
      }),
    });
  }

  ngAfterViewInit() {}

  get isDueToabsenteeism() {
    return this.statusForm.get('absenteeism').value;
  }

  async onProceedClick(statusFormValues: any, statusAbsenteeismFormValues: any, newStatus: string) {
    try {
      const { effectiveDate, supervisorSignature, managerSignature, reason } = statusFormValues;
      const hrTracker: HrTracker = this.data.hrTracker;
      let absenteeism;
      if (this.isDueToabsenteeism) {
        absenteeism = statusAbsenteeismFormValues;
      }
      hrTracker.tracker = {
        statusChange: {
          newStatus,
          effectiveDate,
          absenteeism,
          supervisorSignature,
          managerSignature,
          reason,
        },
      };
      const response = await this.employeeService.saveTracker(hrTracker);
      this.dialogRef.close({
        state: true,
        message: 'Status tracker send successfully',
      });
    } catch (errorResponse) {
      this.dialogRef.close({
        state: false,
        message: errorResponse.error.message,
      });
    }
  }

  onCancelClick(): void {
    this.dialogRef.close({state: false, message: ''});
  }

  /*logDebug(){
    console.log('statusAbsenteeismForm',this.statusAbsenteeismForm.value);
  }*/
}
