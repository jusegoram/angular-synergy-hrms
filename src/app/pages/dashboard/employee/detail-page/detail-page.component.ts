import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeService, SessionService } from '@synergy-app/core/services';
import { ActivatedRoute } from '@angular/router';
import { Employee } from '@synergy-app/shared/models/employee/employee.model';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HrTracker } from '@synergy-app/shared/models/hr-tracker.model';
import { OnSuccessAlertComponent, OnDeleteAlertComponent, OnErrorAlertComponent } from '@synergy-app/shared/modals';
import { RequestInfoChangeDialogComponent } from './containers/request-info-change-dialog/request-info-change-dialog.component';
import { StatusDialogComponent } from './containers/status-dialog/status-dialog.component';
import { CertifyDialogComponent } from './containers/certify-dialog/certify-dialog.component';
import { TRACKER_STATUS, USER_ROLES } from '@synergy/environments';
import { TransferDialogComponent } from './containers/transfer-dialog/transfer-dialog.component';

@Component({
  selector: 'app-detail',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.scss'],
})
export class DetailPageComponent implements OnInit {
  @ViewChild('successAlert', { static: false })
  successAlert: OnSuccessAlertComponent;
  @ViewChild('onDeleteAlert', { static: false })
  onDeleteAlert: OnDeleteAlertComponent;
  @ViewChild('onErrorAlert', { static: false })
  onErrorAlert: OnErrorAlertComponent;

  public auth: any;
  public employee: Employee;

  _roles = USER_ROLES;
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
    public dialog: MatDialog,
    private sessionService: SessionService
  ) {}

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

  openStatusDialog(): void {
    const dialogRef = this.dialog.open(StatusDialogComponent, {
      width: '700px',
      data: { status: this.employee.status, hrTracker: this.hrTracker },
    });
    dialogRef.afterClosed().subscribe((result) => {
      result && result.state ? this.successAlert.fire() : this.onErrorAlert.fire();
    });
  }

  openTransferDialog(): void {
    const dialogRef = this.dialog.open(TransferDialogComponent, {
      width: '700px',
      data: {
        status: this.employee.status,
        hrTracker: this.hrTracker,
        selectedClient: this.employee.company.client,
        selectedCampaign: this.employee.company.campaign,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      result && result.state ? this.successAlert.fire() : this.onErrorAlert.fire();
    });
  }

  openCertifyDialog(): void {
    const dialogRef = this.dialog.open(CertifyDialogComponent, {
      width: '700px',
      data: { status: this.employee.status, hrTracker: this.hrTracker },
    });

    dialogRef.afterClosed().subscribe((result) => {
      result && result.state ? this.successAlert.fire() : this.onErrorAlert.fire();
    });
  }

  openRequestChangeDialog(): void {
    const dialogRef = this.dialog.open(RequestInfoChangeDialogComponent, {
      width: '700px',
      data: { status: this.employee.status, hrTracker: this.hrTracker },
    });

    dialogRef.afterClosed().subscribe((result) => {
      result && result.state ? this.successAlert.fire() : this.onErrorAlert.fire();
    });
  }

  setHrTracker() {
    const { userId, name, role } = this.sessionService.decodeToken();
    this.hrTracker = {
      employee: {
        _id: this.employee._id,
        fullName: this.employee.firstName + ' ' + this.employee.middleName + ' ' + this.employee.lastName,
      },
      employeeId: this.employee.employeeId.toString(),
      state: TRACKER_STATUS.PENDING,
      creationFingerprint: { userId, name, role },
    };
  }

  async onSuccess() {
    this.successAlert.fire();
    try {
      return (this.employee = await this._service.getEmployee(this.employee._id).toPromise());
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
