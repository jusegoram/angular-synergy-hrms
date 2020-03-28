import { Component, Inject } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { EmployeeService } from "../../employee.service";
import { CommonValidator } from "../../../shared/validators/common.validator";
@Component({
  selector: "app-certify-dialog",
  templateUrl: "./certify-dialog.component.html",
  styleUrls: ["./certify-dialog.component.scss"],
})
export class CertifyDialogComponent {
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
      newClient: ["", Validators.required],
      newCampaign: ["", Validators.required],
      certificationDate: [new Date(), Validators.required],
      managerSignature: ["", Validators.required],
    });
  }

  get certificationDateHasError() {
    return this.certifyForm.get("certificationDate").invalid;
  }

  get reasonHasError(){
    return this.certifyForm.get("reason").invalid;
  }

  get newClientHasError() {
    return this.certifyForm.get("newClient").invalid;
  }

  get newCampaignHasError() {
    return this.certifyForm.get("newCampaign").invalid;
  }

  onProceedClick(): void {
    this.dialogRef.close();
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  setCampaigns() {
    if (this.clients) {
      const i = this.clients.findIndex(
        (result) => result.name === this.certifyForm.value.newClient
      );
      if (i >= 0) {
        this.campaigns = this.clients[i].campaigns;
      }
    }
  }
}
