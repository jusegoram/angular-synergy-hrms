import { FormControl } from '@angular/forms';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { PayrollService } from '../../../services/payroll.service';
import { PayrollRow } from '../../manage/PayrollRow';

@Component({
  selector: 'payroll-concept',
  templateUrl: './concept.component.html',
  styleUrls: ['./concept.component.scss']
})
export class ConceptComponent implements OnInit, OnChanges{
  @Input() conceptTitle;
  @Input() concepts;
  @Input() employeeConcept: PayrollRow;
  _employee: any;
  public dataSource: any;

  public reason = new FormControl('');
  public date = new FormControl('');
  public amount = new FormControl('');

  ngOnChanges(changes: SimpleChanges): void {
    const conceptsChanges = changes.concepts;
    this.buildTable(conceptsChanges.currentValue);
  }

  constructor(private _payrollService: PayrollService) {
  }

  ngOnInit() {
    this.buildTable(this.concepts);
    this._employee = this.employeeConcept;
  }
  buildTable(arr) {
    this.dataSource = new MatTableDataSource(arr);
  }

  saveConcept() {
    let addedConcept = this.concept(
      this._employee.employee,
      this._employee.employeeId,
      this.reason.value,
      this.date.value,
      parseInt(this.amount.value, 10));

    switch (this.conceptTitle.toLowerCase()) {
      case 'bonus':
        this.employeeConcept.bonus.push(addedConcept);
        this.buildTable(this.employeeConcept.bonus);
        break;
      case 'other payment':
          this.employeeConcept.otherpay.push(addedConcept);
          this.buildTable(this.employeeConcept.otherpay);
        break;
      case 'deductions':
          this.employeeConcept.deductions.push(addedConcept);
          this.buildTable(this.employeeConcept.deductions);

        break;
      default:
        break;
    }
  }

  editConcept(event) {
    switch (this.conceptTitle) {
      case 'bonus':
        break;
      case 'other payment':
        break;
      case 'deductions':
        break;
      default:
        break;
    }
  }

  deleteConcept(event) {
    switch (this.conceptTitle) {
      case 'bonus':
        break;
      case 'other payment':
        break;
      case 'deductions':
        break;
      default:
        break;
    }
  }

  concept(employee: string, employeeId: string, reason: string, date: Date, amount: number ){
    return {
      employee: employee,
      employeeId: employeeId,
      reason: reason,
      date: date,
      amount: amount,
    };
  }
}
