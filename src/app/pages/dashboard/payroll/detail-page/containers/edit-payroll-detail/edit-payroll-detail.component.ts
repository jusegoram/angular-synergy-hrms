import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PayrollService } from '@synergy-app/core/services/payroll.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-payroll-detail',
  templateUrl: './edit-payroll-detail.component.html',
  styleUrls: ['./edit-payroll-detail.component.scss'],
})
export class EditPayrollDetailComponent implements OnInit {
  currentUser: any;
  concepts$: Observable<Array<any>>;
  constructor(
    public dialogRef: MatDialogRef<EditPayrollDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private payrollService: PayrollService
  ) {}

  ngOnInit() {
    this.currentUser = this.payrollService.getDecodedToken();
    this.fetchConcepts();
  }

  fetchConcepts() {
    this.concepts$ = this.payrollService.getConcepts({
      type: 'Other Payments',
      id: this.data.employee,
      vacations: true,
      assigned: true,
      payroll: this.data.payroll_Id,
    });
  }

  async savePayrollVacation(params) {
    const { payroll, onPayrollSaved } = params;
    try {
      const response = await this.payrollService.updatePayroll(this.data.payroll_Id, payroll, 'VAC').toPromise();
      onPayrollSaved(response);
    } catch (error) {}
  }

  async deleteConcept(item) {
    try {
      await this.payrollService.deleteConcept({ type: 'Other Payments', id: item._id }).toPromise();
    } catch (error) {}
  }

  async confirmConcept(params) {
    const { item, onConceptConfirmStatusSaved } = params;
    try {
      await this.payrollService
        .updateConcept({
          type: 'Other Payments',
          id: [item._id],
          query: {
            verified: true,
            verificationFingerprint: this.currentUser.userId,
          },
        })
        .toPromise();
      item.verified = true;
      item.verificationFingerprint = this.currentUser.userId;
      await this.payrollService
        .updatePayroll(item.payroll, item, 'VAC', this.data._id)
        .toPromise();
      onConceptConfirmStatusSaved(true);

    } catch (error) {}
  }

  onClose() {
    this.dialogRef.close();
  }
}
