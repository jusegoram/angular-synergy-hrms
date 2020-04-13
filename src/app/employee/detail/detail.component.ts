import {Component, OnInit, ViewChild} from '@angular/core';
import {EmployeeService} from '../employee.service';
import {ActivatedRoute} from '@angular/router';
import {Employee} from '../../shared/models/employee/employee';
import {FormBuilder} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {HrTracker} from '../../shared/models/hr-tracker';
import {OnSuccessAlertComponent} from '../../shared/modals/on-success-alert/on-success-alert.component';
import {OnDeleteAlertComponent} from '../../shared/modals/on-delete-alert/on-delete-alert.component';
import {OnErrorAlertComponent} from '../../shared/modals/on-error-alert/on-error-alert.component';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  @ViewChild('successAlert', {static: false})
  successAlert: OnSuccessAlertComponent;
  @ViewChild('onDeleteAlert', {static: false})
  onDeleteAlert: OnDeleteAlertComponent;
  @ViewChild('onErrorAlert', {static: false})
  onErrorAlert: OnErrorAlertComponent;

  private auth: any;
  private employee: Employee;


  hrTracker: HrTracker;
  helpMessage = `
  HELPING TOOLTIP:
  \u2022\STATUS\xA0TRACKER\xA0:\xA0Every time an employee's status
  is changed an 'STATUS TRACKER' must be filled. Please follow the
  directions once you have clicked the button to request and attrition.
  \xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0
  \xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0
  \xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0
  \u2022\xA0TRANSFER\xA0TRACKER\xA0:\xA0Every\xA0time\xA0an employee's campaign
  is changed a 'TRANSFER TRACKER' must be filled. Please follow the
  directions once you have clicked the button to request a campaign change.
  \xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0
  \xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0
  \xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0
  \u2022\xA0CERTIFY\xA0TRACKER\xA0:\xA0Every\xA0time\xA0an employee is certified after training
  a 'CERTIFY TRACKER' must be filled so that the position can be changed. Please follow the
  directions once you have clicked the button to request a certification.
  \xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0
  \xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0
  \xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0
  \u2022\xA0REQUEST\xA0INFO\xA0CHANGE\xA0:\xA0If\xA0you\xA0find outdated or incorrect information please
  request and info change to minimize report and payroll errors.

 `;
  constructor(
    private _service: EmployeeService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.auth = this._service.getAuth();
    this.employee = this.route.snapshot.data['employee'];
    this.setHrTracker();
  }

  // transformDate(date: Date) {
  //   const dp = new DatePipe('en-US');
  //   const p = 'M/dd/yyyy';
  //   const dtr = dp.transform(date, p);
  //   return dtr;
  // }


  // openStatusDialog(): void {
  //   const dialogRef = this.dialog.open(StatusDialogComponent, {
  //     width: '700px',
  //     data: { status: this.employee.status, hrTracker: this.hrTracker }
  //   });
  //
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (!result.status) {
  //       this.mainForm.patchValue({
  //         status: this.employee.status.toLowerCase()
  //       });
  //     } else {
  //       this.statusChange = result;
  //     }
  //
  //     if (result.message) {
  //       this.snackBar.open(result.message, 'OK', {
  //         duration: 3000,
  //         horizontalPosition: 'end'
  //       });
  //     }
  //   });
  // }
  // openTransferDialog(): void {
  //   const dialogRef = this.dialog.open(TransferDialogComponent, {
  //     width: '700px',
  //     data: {
  //       status: this.mainForm.value.status,
  //       selectedClient: this.companyForm.value.client,
  //       selectedCampaign: this.companyForm.value.campaign,
  //       hrTracker: this.hrTracker
  //     }
  //   });
  //
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (!result.status) {
  //       this.mainForm.patchValue({
  //         status: this.employee.status.toLowerCase()
  //       });
  //     } else {
  //       this.statusChange = result;
  //     }
  //
  //     if (result.message) {
  //       this.snackBar.open(result.message, 'OK', {
  //         duration: 3000,
  //         horizontalPosition: 'end'
  //       });
  //     }
  //   });
  // }
  // openCertifyDialog(): void {
  //   const dialogRef = this.dialog.open(CertifyDialogComponent, {
  //     width: '700px',
  //     data: { status: this.mainForm.value.status, hrTracker: this.hrTracker }
  //   });
  //
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (!result.status) {
  //       this.mainForm.patchValue({
  //         status: this.employee.status.toLowerCase()
  //       });
  //     } else {
  //       this.statusChange = result;
  //     }
  //
  //     if (result.message) {
  //       this.snackBar.open(result.message, 'OK', {
  //         duration: 3000,
  //         horizontalPosition: 'end'
  //       });
  //     }
  //   });
  // }
  // openRequestChangeDialog(): void {
  //   const dialogRef = this.dialog.open(RequestInfoChangeDialogComponent, {
  //     width: '700px',
  //     data: { status: this.mainForm.value.status, hrTracker: this.hrTracker }
  //   });
  //
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (!result.status) {
  //       this.mainForm.patchValue({
  //         status: this.employee.status.toLowerCase()
  //       });
  //     } else {
  //       this.statusChange = result;
  //     }
  //
  //     if (result.message) {
  //       this.snackBar.open(result.message, 'OK', {
  //         duration: 3000,
  //         horizontalPosition: 'end'
  //       });
  //     }
  //   });
  // }

  setHrTracker() {
    this.hrTracker = {
      employee: this.employee._id,
      employeeId: this.employee._id,
      state: 0
    };
  }

  async onSuccess() {
    this.successAlert.fire();
    try {
      return this.employee = await this._service.getEmployee(this.employee._id).toPromise();
    } catch (e) {
      return;
    }
  }

  onError() {
    this.onErrorAlert.fire();
  }

  onDelete(e) {
    this.onDeleteAlert.fire(e);
  }
}
