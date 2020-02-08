import { PayrollService } from './../../../services/payroll.service';
import { MatTableDataSource } from '@angular/material/table';
import { PayrollRow } from './../../manage/PayrollRow';
import { Payroll } from './../../manage/Payroll';
import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  OnChanges,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'app-edit-payroll',
  templateUrl: './edit-payroll.component.html',
  styleUrls: ['./edit-payroll.component.scss']
})
export class EditPayrollComponent implements OnInit, OnChanges {
  @Input() payroll: any;
  @Output() onApplyUpdate = new EventEmitter();
  employee: PayrollRow;
  CSLDatasource: any;
  MATDatasource: any;
  VACDatasource: any;
  FPDatasource: any;
  selectedTabString = 'CSL';
  CSL = 'CSL';
  MAT = 'MAT';
  VAC = 'VAC';
  FP = 'FP';
  query = {
    type: 'otherpayments',
    id: 'all',
    verified: true,
    payed: false,
    maternity: false,
    csl: false
  };
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.payroll) {
    }
  }
  constructor(private _payrollService: PayrollService) {}

  ngOnInit() {
    this.selectedTab(0);
  }
  selectedTab = event => {
    switch (event) {
      case 0:
        this.getSickLeaves();
        break;
      case 1:
        this.getMaternity();
        break;
      case 2:
        this.getVacations();
        break;
      case 3:
        this.getFinalPayments();
        break;
      default:
        break;
    }
  }

  getSickLeaves() {
    this.serviceCSLOrMaternity(true, false);
    this.clearTables(this.CSL);
    this.selectedTabString = this.CSL;
  }
  getMaternity() {
    this.serviceCSLOrMaternity(false, true);
    this.clearTables(this.MAT);
    this.selectedTabString = this.MAT;
  }
  getVacations() {
    this.VACDatasource = new MatTableDataSource();
    this.clearTables(this.VAC);
    this.selectedTabString = this.VAC;
  }
  getFinalPayments() {
    this.FPDatasource = new MatTableDataSource();
    this.clearTables(this.FP);
    this.selectedTabString = this.FP;
  }

  serviceCSLOrMaternity(csl, maternity?) {
    const query = this.query;
    this._payrollService
      .getConcepts(
        query.type,
        query.id,
        query.verified,
        query.payed,
        maternity,
        csl
      )
      .subscribe(res => {
        if (maternity) {
          this.MATDatasource = new MatTableDataSource(res);
        } else if (csl) {
          this.CSLDatasource = new MatTableDataSource(res);
        }
      });
  }
  clearTables(selectedDatasource) {
    const datasources = [
      { name: this.CSL, ds: 'CSLDatasource' },
      { name: this.MAT, ds: 'MATDatasource' },
      { name: this.VAC, ds: 'VACDatasource' },
      { name: this.FP, ds: 'FPDatasource' }
    ];
    datasources
      .filter(i => i.name !== selectedDatasource)
      .forEach(f => {
        this[f.ds] = undefined;
      });
  }

  applyUpdate(item) {
    const index = this.payroll.employees.findIndex(
      element => element.employeeId.toString() === item.employeeId.toString()
    );
    if (index >= 0) {
      const element = this.payroll.employees[index];
      const newRow = new PayrollRow(
        null,
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        null,
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        ''
      );
      const elementCast = Object.assign(newRow, element);
      elementCast.otherpay.push(item);
      elementCast
        .calculateConceptsGrossAndNet(
          this.payroll.socialTable,
          this.payroll.incometaxTable
        )
        .then(result => {
          switch (this.selectedTabString) {
            case this.CSL:
              this.applyCSL(elementCast, index);
              break;
            case this.MAT:
              this.applyMaternity(elementCast, index);
              break;
            case this.VAC:
              break;
            case this.FP:
              break;
            default:
              break;
          }
        });
    }
  }

  applyCSL(elementCast, index) {
    this.payroll.employees[index] = elementCast;
    this._payrollService
      .updatePayroll(this.payroll._id, this.payroll.employees[index], this.CSL)
      .subscribe(arg => {
        this.onApplyUpdate.emit(arg);
      });
  }
  applyMaternity(elementCast, index) {
    this.payroll.employees[index] = elementCast;
    this._payrollService
      .updatePayroll(this.payroll._id, this.payroll.employees[index], 'CSL')
      .subscribe(arg => {
        this.onApplyUpdate.emit(arg);
      });
  }
  appleVacations() {}
  applyFinalPayment() {}
  adjustHours() {}
}
