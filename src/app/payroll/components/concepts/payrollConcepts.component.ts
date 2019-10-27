import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PayrollService } from '../../services/payroll.service';

@Component({
  selector: 'app-deduction',
  templateUrl: './payrollConcepts.component.html',
  styleUrls: ['./payrollConcepts.component.scss']
})
export class PayrollConceptsComponent implements OnInit {
  public title: string;
  employee: any;
  error: boolean;
  constructor(private _payrollService: PayrollService, public dialogRef: MatDialogRef<PayrollConceptsComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any) {
  }
  ngOnInit() {
    this.title = `${this.data.employeeName}'s Payroll Concepts`;

  }

  onSave(){
    this.dialogRef.close();
  }

  getLastYearPayrolls(id) {
    this._payrollService.getLastYearPayrolls(id).subscribe(result => {
    })
  }
}
