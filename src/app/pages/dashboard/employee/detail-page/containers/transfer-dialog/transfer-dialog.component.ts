import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { EmployeeService } from '@synergy-app/core/services';
import { HrTracker } from '@synergy-app/shared/models';
import { CommonValidator } from '@synergy-app/shared/validators/common.validator';
@Component({
  selector: 'app-transfer-dialog',
  templateUrl: './transfer-dialog.component.html',
  styleUrls: ['./transfer-dialog.component.scss']
})
export class TransferDialogComponent implements OnInit {
  transferFom: FormGroup;
  clients: any[];
  campaigns: any[];

  constructor(
    public dialogRef: MatDialogRef<TransferDialogComponent>,
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  get effectiveDateHasError() {
    return this.transferFom.get('effectiveDate').invalid;
  }

  get newClientHasError() {
    return this.transferFom.get('newClient').invalid;
  }

  get newCampaignHasError() {
    return this.transferFom.get('newCampaign').invalid;
  }

  get reasonHasError() {
    return this.transferFom.get('reason').invalid;
  }

  ngOnInit() {
    this.clients = this.employeeService.clients;
    this.transferFom = this.formBuilder.group({
      reason: ['', [Validators.required, CommonValidator.emptyFieldValidator]],
      oldClient: [this.data.selectedClient],
      oldCampaign: [this.data.selectedCampaign],
      newClient: ['', Validators.required],
      newCampaign: ['', Validators.required],
      effectiveDate: [new Date(), Validators.required],
      managerSignature: ['', Validators.required],
    });
    this.setCampaigns();
  }

  setCampaigns() {
    if (this.clients) {
      const i = this.clients.findIndex((result) => result.name === this.transferFom.value.newClient);
      if (i >= 0) {
        this.campaigns = this.clients[i].campaigns;
      }
    }
    this.transferFom.get('newCampaign').setValue('');
  }

  async onProceedClick(formValues: any) {
    try {
      const { effectiveDate, oldClient, oldCampaign, newClient, newCampaign, reason, managerSignature } = formValues;
      const hrTracker: HrTracker = this.data.hrTracker;
      hrTracker.tracker = {
        transfer: {
          effectiveDate,
          oldClient,
          oldCampaign,
          newClient,
          newCampaign,
          reason,
          managerSignature,
        },
      };
      const response = await this.employeeService.saveTracker(hrTracker);
      this.dialogRef.close({
        state: true,
        message: 'Transfer tracker info send successfully'
      });
    } catch (error) {
      this.dialogRef.close({
        state: false,
        message: 'We couldn\'t send your request. Try again later.'
      });
    }
  }

  onCancelClick(): void {
    this.dialogRef.close({state: false, message: ''});
  }
}
