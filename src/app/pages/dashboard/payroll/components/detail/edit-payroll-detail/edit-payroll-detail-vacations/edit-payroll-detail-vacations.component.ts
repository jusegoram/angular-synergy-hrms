import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PayrollService } from '@synergy-app/pages/dashboard/payroll/services/payroll.service';
import { noop } from 'rxjs';
import { TIME_VALUES } from '@synergy/environments/enviroment.common';

@Component({
  selector: 'app-edit-payroll-detail-vacations',
  templateUrl: './edit-payroll-detail-vacations.component.html',
  styleUrls: ['./edit-payroll-detail-vacations.component.scss'],
})
export class EditPayrollDetailVacationsComponent implements OnInit {
  @ViewChild('editCell', {static: true}) editCell: TemplateRef<any>;
  @ViewChild('confirmSwal') private confirmSwal: SwalComponent;
  @ViewChild('successSwal') private successSwal: SwalComponent;

  @Input() row: any;
  columns: any[] = [];
  rows = new Array<any>();
  vacationsForm: FormGroup;
  ColumnMode = ColumnMode;
  user: any;

  constructor(
    private fb: FormBuilder,
    private _payrollService: PayrollService,
    private _currencyPipe: CurrencyPipe,
    private _datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.user = this._payrollService.getDecodedToken();
    this.columns = [
      {name: 'FROM', prop: 'from', pipe: this.datePipe()},
      {name: 'TO', prop: 'to', pipe: this.datePipe()},
      {name: 'AMOUNT', prop: 'amount', width: 85, pipe: this._currencyPipe},
      {name: 'CONFIRM | DELETE', cellTemplate: this.editCell, width: 155},
    ];
    this.buildForm();
    this.loadData();
  }

  datePipe() {
    return {
      transform: (value) => this._datePipe.transform(value, 'MM/dd/yyyy'),
    };
  }
  buildForm() {
    const r = this.row;
    this.vacationsForm = this.fb.group({
      type: ['Other Payments'],
      vacations: [true],
      employee: [r.employee],
      employeeName: [r.employeeName],
      employeeId: [r.employeeId],
      reason: ['Vacations Leave'],
      date: [r.fromDate],
      from: ['', Validators.required],
      to: ['', Validators.required],
      amount: ['', Validators.required],
      creationFingerprint: [this.user.userId],
      submittedDate: [new Date()],
      createdBy: [this.user.userId],
      assigned: [true],
      payroll: [r.payroll_Id],
    });
  }

  calculateDaysDiff(from, to) {
    if (from && to) {
      const timeDiff = to.getTime() - from.getTime();
      return timeDiff / (1000 * TIME_VALUES.SECONDS_PER_HOUR * TIME_VALUES.HOURS_PER_DAY);
    }
    return null;
  }

  loadData() {
    console.log(this.row);
    this._payrollService
      .getConcepts({
        type: 'Other Payments',
        id: this.row.employee,
        vacations: true,
        assigned: true,
        payroll: this.row.payroll_Id,
      })
      .subscribe((result) => {
        this.rows = [...result];
      });
  }
  saveValue() {
    this._payrollService
      .updatePayroll(
        this.row.payroll_Id,
        {
          ...this.vacationsForm.value,
          totalDays: this.calculateDaysDiff(this.vacationsForm.value.from, this.vacationsForm.value.to),
        },
        'VAC'
      )
      .subscribe((result) => {
        this.rows = [...this.rows, result];
        this.buildForm();
      });
  }
  confirmValue(...args) {
    const [rowItem, index] = args;
    if (this.user.userId === rowItem.creationFingerprint) {
      this.confirmSwal.fire().then((e) => noop());
    } else {
      this._payrollService
        .updateConcept({
          type: 'Other Payments',
          id: [rowItem._id],
          query: {
            verified: true,
            verificationFingerprint: this.user.userId,
          },
        })
        .subscribe((result) => {
          if (result) {
            rowItem.verified = true;
            rowItem.verificationFingerprint = this.user.userId;
            this._payrollService
              .updatePayroll(rowItem.payroll, rowItem, 'VAC', this.row._id)
              .subscribe((finalResult) => {
                this.successSwal
                  .fire()
                  .then((e) => console.log(e))
                  .catch((e) => console.log(e));
              });
          }
        });
    }
  }
  deleteValue(item, index) {
    this._payrollService.deleteConcept({type: 'Other Payments', id: item._id}).subscribe((result) => {
      this.rows.splice(index, 1);
    });
  }
}
