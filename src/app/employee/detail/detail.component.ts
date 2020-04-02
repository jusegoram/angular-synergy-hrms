import { RequestInfoChangeDialogComponent } from "./request-info-change-dialog/request-info-change-dialog.component";
import { CertifyDialogComponent } from "./certify-dialog/certify-dialog.component";
import { TransferDialogComponent } from "./transfer-dialog/transfer-dialog.component";
import { StatusDialogComponent } from "./status-dialog/status-dialog.component";
import { SessionService } from "../../session/session.service";
import { Component, OnInit, OnChanges, SimpleChanges } from "@angular/core";
import { EmployeeService } from "../employee.service";
import { ActivatedRoute } from "@angular/router";
import { Employee, EmployeeCompany, Position } from "../Employee";
import { FormGroup, FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable } from "rxjs";
import { Client } from "../../administration/employee/models/positions-models";
import { DatePipe, AsyncPipe } from "@angular/common";
import { async } from "@angular/core/testing";
import { HrTracker } from "../../shared/models/hr-tracker";
import { TRACKER_STATUS } from "../../../environments/environment";

@Component({
  selector: "app-detail",
  templateUrl: "./detail.component.html",
  styleUrls: ["./detail.component.scss"]
})
export class DetailComponent implements OnInit {
  auth: any;
  employee: Employee;
  positions: any;
  latestPos: any;
  company: any;
  newCompany: any;
  isNewCompany: boolean;
  mainForm: FormGroup;
  companyForm: FormGroup;
  clients: any[];
  campaigns: any[];
  items: any[];
  reaptimes: any[];
  genders: any[];
  statusChange = false;
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
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    public snackBar: MatSnackBar,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {
    this.newCompany = new EmployeeCompany(
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      null,
      null,
      null,
      null,
      null,
      false
    );
    this.isNewCompany = false;
    this.items = this.employeeService.status;
    this.reaptimes = this.employeeService.reaptimes;
    this.genders = this.employeeService.genders;
  }

  ngOnInit() {
    this.auth = this.employeeService.getAuth();
    this.clients = this.employeeService.clients;
    this.employee = this.route.snapshot.data["employee"];
    this.positions = this.employee.position;
    if (!this.positions[0]) {
      this.latestPos = new Position();
    } else {
      const i = this.positions.length - 1;
      this.latestPos = this.positions[i];
    }
    if (!this.employee.company) {
      this.employee.company = this.newCompany;
      this.isNewCompany = true;
    }
    this.company = this.employee.company;
    this.buildForms();
    if (!this.clients) {
      this.employeeService.getClient().subscribe(data => {
        this.clients = data;
        this.setCampaigns();
      });
    }
    this.setCampaigns();
    this.setHrTracker();
  }

  transformDate(date: Date) {
    const dp = new DatePipe("en-US");
    const p = "M/dd/yyyy";
    const dtr = dp.transform(date, p);
    return dtr;
  }
  buildForms() {
    this.mainForm = this.fb.group({
      firstName: [this.employee.firstName],
      middleName: [this.employee.middleName],
      lastName: [this.employee.lastName],
      gender: [this.employee.gender.toLowerCase()],
      status: [this.employee.status.toLowerCase()],
      currentPosition: [this.latestPos.position.name],
      currentPositionId: [this.latestPos.position.positionId],
      currentPositionDate: [this.transformDate(this.latestPos.startDate)]
    });
    this.companyForm = this.fb.group({
      client: [this.company.client],
      campaign: [this.company.campaign],
      manager: [this.company.manager],
      supervisor: [this.company.supervisor],
      trainer: [this.company.trainer],
      trainingGroupRef: [this.company.trainingGroupRef],
      trainingGroupNum: [this.company.trainingGroupNum],
      hireDate: [this.company.hireDate],
      terminationDate: [this.company.terminationDate],
      reapplicant: [this.company.reapplicant],
      reapplicantTimes: [this.company.reapplicantTimes],
      bilingual: [this.company.bilingual]
    });
  }
  onSubmit() {
    const employee = new Employee(
      this.employee._id,
      this.employee.employeeId,
      this.mainForm.value.firstName,
      this.mainForm.value.lastName,
      this.employee.socialSecurity,
      this.mainForm.value.status,
      this.mainForm.value.gender, // add to form
      this.mainForm.value.middleName
    );

    if (this.statusChange) {
      console.log("execute status change");
    }
    this.employeeService.updateEmployee(employee).subscribe(
      data => {
        this.snackBar.open(
          "Employee information updated successfully",
          "thank you",
          {
            duration: 2000
          }
        );
      },
      error => {
        this.snackBar.open(
          "Error updating information, please try again or notify the IT department",
          "Try again",
          {
            duration: 2000
          }
        );
      }
    );
  }

  onCompanySubmit() {
    const employeeCompany = new EmployeeCompany(
      this.company._id,
      this.employee.employeeId + "",
      this.employee._id,
      this.companyForm.value.client,
      this.companyForm.value.campaign,
      this.companyForm.value.manager,
      this.companyForm.value.supervisor,
      this.companyForm.value.trainer,
      this.companyForm.value.trainingGroupRef,
      this.companyForm.value.trainingGroupNum,
      this.companyForm.value.hireDate,
      this.companyForm.value.terminationDate,
      this.companyForm.value.reapplicant,
      this.companyForm.value.reapplicantTimes,
      this.companyForm.value.bilingual
    );
    if (!this.isNewCompany) {
      this.employeeService.updateCompany(employeeCompany).subscribe(
        data => {
          this.snackBar.open(
            "Employee comapany information updated successfully",
            "Thank you",
            {
              duration: 2000
            }
          );
        },
        error => {
          this.snackBar.open(
            "Error updating information, please try again or notify the IT department",
            "Try again",
            {
              duration: 2000
            }
          );
        }
      );
    } else {
      this.employeeService.saveCompany(employeeCompany).subscribe(
        data => {
          this.snackBar.open(
            "Employee comapany information updated successfully",
            "Thank you",
            {
              duration: 2000
            }
          );
          this.company = data;
          this.isNewCompany = false;
        },
        error => {
          this.snackBar.open(
            "Error updating information, please try again or notify the IT department",
            "Try again",
            {
              duration: 2000
            }
          );
        }
      );
    }
  }

  setCampaigns() {
    if (this.clients) {
      const i = this.clients.findIndex(
        result => result.name === this.companyForm.value.client
      );
      if (i >= 0) {
        this.campaigns = this.clients[i].campaigns;
      }
    }
  }

  openStatusDialog(): void {
    const dialogRef = this.dialog.open(StatusDialogComponent, {
      width: "700px",
      data: { status: this.mainForm.value.status, hrTracker: this.hrTracker }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result.status) {
        this.mainForm.patchValue({
          status: this.employee.status.toLowerCase()
        });
      } else {
        this.statusChange = result;
      }

      if (result.message) {
        this.snackBar.open(result.message, "OK", {
          duration: 3000,
          horizontalPosition: "end"
        });
      }
    });
  }
  openTransferDialog(): void {
    const dialogRef = this.dialog.open(TransferDialogComponent, {
      width: "700px",
      data: {
        status: this.mainForm.value.status,
        selectedClient: this.companyForm.value.client,
        selectedCampaign: this.companyForm.value.campaign,
        hrTracker: this.hrTracker
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result.status) {
        this.mainForm.patchValue({
          status: this.employee.status.toLowerCase()
        });
      } else {
        this.statusChange = result;
      }

      if (result.message) {
        this.snackBar.open(result.message, "OK", {
          duration: 3000,
          horizontalPosition: "end"
        });
      }
    });
  }
  openCertifyDialog(): void {
    const dialogRef = this.dialog.open(CertifyDialogComponent, {
      width: "700px",
      data: { status: this.mainForm.value.status, hrTracker: this.hrTracker }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result.status) {
        this.mainForm.patchValue({
          status: this.employee.status.toLowerCase()
        });
      } else {
        this.statusChange = result;
      }

      if (result.message) {
        this.snackBar.open(result.message, "OK", {
          duration: 3000,
          horizontalPosition: "end"
        });
      }
    });
  }
  openRequestChangeDialog(): void {
    const dialogRef = this.dialog.open(RequestInfoChangeDialogComponent, {
      width: "700px",
      data: { status: this.mainForm.value.status, hrTracker: this.hrTracker }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result.status) {
        this.mainForm.patchValue({
          status: this.employee.status.toLowerCase()
        });
      } else {
        this.statusChange = result;
      }

      if (result.message) {
        this.snackBar.open(result.message, "OK", {
          duration: 3000,
          horizontalPosition: "end"
        });
      }
    });
  }

  setHrTracker() {
    this.hrTracker = {
      employee: this.employee._id, //selected employee for track
      employeeId: this.employee._id,
      state: TRACKER_STATUS.PENDING
    };
  }
}
