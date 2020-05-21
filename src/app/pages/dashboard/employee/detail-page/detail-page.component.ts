import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeService, SessionService } from '@synergy-app/core/services';
import { ActivatedRoute } from '@angular/router';
import {
  Employee,
  EmployeePayroll,
  HrTracker,
  EmployeePersonal,
  EmployeeAttrition,
  EmployeeComment,
  EmployeeFamily,
  EmployeeCompany,
} from '@synergy-app/shared/models';
import { MatDialog } from '@angular/material/dialog';
import { OnSuccessAlertComponent, OnDeleteAlertComponent, OnErrorAlertComponent } from '@synergy-app/shared/modals';
import {
  RequestInfoChangeDialogComponent
} from './containers/request-info-change-dialog/request-info-change-dialog.component';
import { StatusDialogComponent } from './containers/status-dialog/status-dialog.component';
import { CertifyDialogComponent } from './containers/certify-dialog/certify-dialog.component';
import { TRACKER_STATUS, USER_ROLES } from '@synergy/environments';
import { TransferDialogComponent } from './containers/transfer-dialog/transfer-dialog.component';
import { Observable, noop } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  shifts$: Observable<any>;
  clients$: Observable<any>;
  departments$: Observable<any>;
  superiors$: Observable<any>;
  currentUser: any;

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private sessionService: SessionService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.auth = this.employeeService.getAuth();
    this.employee = this.route.snapshot.data['employee'];
    this.setCurrentUser();
    this.setHrTracker();
    this.fetchClients();
    this.fetchDepartments();
  }

  setCurrentUser() {
    const userFullName = this.sessionService.getName();
    const nameParts = userFullName.split(' ');
    this.currentUser = {
      _id: this.sessionService.getId(),
      fullName: userFullName,
      firstName: nameParts[0],
      lastName: nameParts[nameParts.length - 1],
    };
  }

  fetchClients() {
    this.clients$ = this.employeeService.getClient();
  }

  fetchDepartments() {
    this.departments$ = this.employeeService.getDepartment();
  }

  fetchEmployeeShifts(params) {
    const { employee, fromDate, toDate } = params;
    this.shifts$ = this.employeeService.getEmployeeShift(employee, fromDate, toDate);
  }

  async updateEmployeeShift(params) {
    const { employee, shift } = params;
    try {
      await this.employeeService.updateEmployeeShift(employee, shift).toPromise();
      this.snackbar.open('Perfect! The shift was updated successfully: Please refresh to verify', 'Thank you!', {
        duration: 10000,
      });
    } catch (error) {
      this.snackbar.open(error.message, 'Thank you!', { duration: 10000 });
    }
  }

  async deletePosition(params: any) {
    try {
      await this.employeeService.deletePosition(params.data).toPromise();
      await params.removingItemFromTable();
      return this.onSuccess();
    } catch (e) {
      return this.onError();
    }
  }

  async addPosition(params: any) {
    try {
      const { doc }: any = await this.employeeService.savePosition(params.data).toPromise();
      params.onPositionAdded(doc.position);
      return this.onSuccess();
    } catch (e) {
      return this.onError();
    }
  }

  async savePayroll(payroll: EmployeePayroll) {
    try {
      if (payroll._id === '') {
        delete payroll._id;
        await this.employeeService.savePayroll(payroll).toPromise();
      } else {
        await this.employeeService.updatePayroll(payroll).toPromise();
      }
      this.onSuccess();
    } catch (e) {
      this.onError();
    }
  }

  async savePersonalInfo(employeePersonal: EmployeePersonal) {
    try {
      if (employeePersonal._id && employeePersonal._id.length > 0) {
        delete employeePersonal._id;
        await this.employeeService.updatePersonal(employeePersonal).toPromise();
      } else {
        delete employeePersonal._id;
        await this.employeeService.savePersonal(employeePersonal).toPromise();
      }
      return this.onSuccess();
    } catch (e) {
      return this.onError();
    }
  }

  async saveAttrition(attrition: EmployeeAttrition) {
    try {
      await this.employeeService.saveAttrition(attrition).toPromise();
      return this.onSuccess();
    } catch (e) {
      return this.onError();
    }
  }

  async deleteAttrition(attrition: EmployeeAttrition) {
    try {
      await this.employeeService.deleteAttrition(attrition).toPromise();
      return this.onSuccess();
    } catch (e) {
      return this.onError();
    }
  }

  async saveComment(comment: EmployeeComment) {
    try {
      await this.employeeService.saveComment(comment).toPromise();
      return this.onSuccess();
    } catch (e) {
      return this.onError();
    }
  }

  async deleteComment(comment: EmployeeComment) {
    try {
      await this.employeeService.deleteComment(comment).toPromise();
      return this.onSuccess();
    } catch (e) {
      return this.onError();
    }
  }

  async saveFamily(family: EmployeeFamily) {
    try {
      await this.employeeService.saveFamily(family).toPromise();
      return this.onSuccess();
    } catch (e) {
      return this.onError();
    }
  }

  async deleteFamily(family: EmployeeFamily) {
    try {
      await this.employeeService.deleteFamily(family).toPromise();
      return this.onSuccess();
    } catch (e) {
      return this.onError();
    }
  }

  async updateEmployeeMainInfo(employee: Employee) {
    try {
      await this.employeeService.updateEmployee(employee).toPromise();
      return this.onSuccess();
    } catch (e) {
      return this.onError();
    }
  }

  async saveCompany(params: { company: EmployeeCompany; shouldUpdateCompany: boolean }) {
    try {
      if (params.shouldUpdateCompany) {
        await this.employeeService.updateCompany(params.company).toPromise();
      } else {
        await this.employeeService.saveCompany(params.company).toPromise();
      }
      return this.onSuccess();
    } catch (e) {
      return this.onError();
    }
  }

  fetchSuperiors(client) {
    this.superiors$ = this.employeeService.getEmployeeManagers([client]);
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
      return (this.employee = await this.employeeService.getEmployee(this.employee._id).toPromise());
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
