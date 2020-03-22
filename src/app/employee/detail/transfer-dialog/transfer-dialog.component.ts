import { Component, Inject } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material/dialog";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { EmployeeService } from "../../employee.service";
@Component({
  selector: "app-transfer-dialog",
  templateUrl: "./transfer-dialog.component.html",
  styleUrls: ["./transfer-dialog.component.scss"]
})
export class TransferDialogComponent {
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
    return this.transferFom.get("effectiveDate").invalid;
  }

  get newClientHasError(){
    return this.transferFom.get("newClient").invalid;
  }

  get newCampaignHasError(){
    return this.transferFom.get("newCampaign").invalid;
  }

  ngOnInit() {
    this.clients = this.employeeService.clients;
    this.transferFom = this.formBuilder.group({
      oldClient: [this.data.selectedClient],
      oldCampaign: [this.data.selectedCampaign],
      newClient: ["", Validators.required],
      newCampaign: ["", Validators.required],
      effectiveDate: [new Date(), Validators.required],
      managerSignature: ["", Validators.required]
    });
    this.setCampaigns();
  }

  setCampaigns() {
    if (this.clients) {
      const i = this.clients.findIndex(
        result => result.name === this.transferFom.value.newClient
      );
      if (i >= 0) {
        this.campaigns = this.clients[i].campaigns;
      }
    }
  }

  onProceedClick(): void {
    this.dialogRef.close(true);
  }
  onCancelClick(): void {
    this.dialogRef.close();
  }
}
