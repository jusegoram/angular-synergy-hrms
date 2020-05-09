import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmployeeService } from '@synergy-app/core/services';
import { CommonValidator } from '@synergy-app/shared/validators/common.validator';
import { HrTracker } from '@synergy-app/shared/models';
@Component({
  selector: 'app-certify-dialog',
  templateUrl: './certify-dialog.component.html',
  styleUrls: ['./certify-dialog.component.scss'],
})
export class CertifyDialogComponent implements OnInit {
  certifyForm: FormGroup;
  clients: any[];
  campaigns: any[];

  constructor(
    public dialogRef: MatDialogRef<CertifyDialogComponent>,
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.clients = this.employeeService.clients;
    this.certifyForm = this.formBuilder.group({
      reason: ['', [Validators.required, CommonValidator.emptyFieldValidator]],
      client: ['', Validators.required],
      campaign: ['', Validators.required],
      certificationDate: [new Date(), Validators.required],
      managerSignature: ['', Validators.required],
    });
  }

  get certificationDateHasError() {
    return this.certifyForm.get('certificationDate').invalid;
  }

  get reasonHasError() {
    return this.certifyForm.get('reason').invalid;
  }

  get clientHasError() {
    return this.certifyForm.get('client').invalid;
  }

  get campaignHasError() {
    return this.certifyForm.get('campaign').invalid;
  }

  async onProceedClick(formValues: any) {
    try {
      const { certificationDate, client, campaign, reason, managerSignature } = formValues;
      const hrTracker: HrTracker = this.data.hrTracker;
      hrTracker.tracker = {
        certifyTraining: {
          certificationDate,
          client,
          campaign,
          reason,
          managerSignature,
        },
      };
      const response = await this.employeeService.saveTracker(hrTracker);
      this.dialogRef.close({
        state: true,
        message: 'Certify training tracker send successfully',
      });
    } catch (error) {
      this.dialogRef.close({
        state: false,
        message: 'We couldn\'t send your request. Try again later.',
      });
    }
  }

  onCancelClick(): void {
    this.dialogRef.close({ state: false, message: '' });
  }

  setCampaigns() {
    if (this.clients) {
      const i = this.clients.findIndex((result) => result.name === this.certifyForm.value.client);
      if (i >= 0) {
        this.campaigns = this.clients[i].campaigns;
      }
    }
    this.certifyForm.get('campaign').setValue('');
  }
}
