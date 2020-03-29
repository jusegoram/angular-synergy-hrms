import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import { EmployeeService } from "./../../employee.service";
import {
  AfterViewInit,
  Component,
  Inject,
  QueryList,
  ViewChildren
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { SignatureFieldComponent } from "../../../shared/signature-field/signature-field.component";
import { HrTracker } from "../../../shared/models/hr-tracker";

@Component({
  selector: "app-status-dialog",
  templateUrl: "./status-dialog.component.html",
  styleUrls: ["./status-dialog.component.scss"]
})
export class StatusDialogComponent implements AfterViewInit {
  @ViewChildren(SignatureFieldComponent) public signatures: QueryList<
    SignatureFieldComponent
  >;
  supervisor = 0;
  manager = 1;
  statusForm: FormGroup;
  status: any[];
  statusControl: FormControl;
  constructor(
    public dialogRef: MatDialogRef<StatusDialogComponent>,
    private _employeeService: EmployeeService,
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.statusControl = new FormControl("", Validators.required);
    this.status = this._employeeService.status;
    this.statusForm = fb.group({
      effectiveDate: [new Date(), Validators.required],
      supervisorSignature: ["", Validators.required],
      managerSignature: ["", Validators.required]
    });
  }

  ngAfterViewInit() {}

  async onProceedClick(formValues: any, newStatus: string) {
    try {
      let { effectiveDate, supervisorSignature, managerSignature } = formValues;
      let hrTracker: HrTracker = this.data.hrTracker;
      hrTracker.tracker = {
        statusChange: {
          newStatus,
          effectiveDate,
          absenteeism: null,
          supervisorSignature,
          managerSignature
        }
      };
      console.log("data sent", hrTracker);
      const response = await this.employeeService.saveTracker(hrTracker);
      this.dialogRef.close({
        state: true,
        message: "Status tracker send successfully"
      });
    } catch (error) {
      this.dialogRef.close({
        state: false,
        message: "We couldn't send your request. Try again later."
      });
    }
  }

  onCancelClick(): void {
    this.dialogRef.close({ state: false, message: "" });
  }
}
