import {PayrollRow} from './PayrollRow';
import * as moment from 'moment';

export class Payroll {

  private _employees: PayrollRow[] = [];
  private _holidayTable: any[] = [];
  private _fromDate;
  private _toDate;
  private _socialTable;
  private _exceptionsTable;
  private _otherpayTable;
  private _deductionsTable;
  private _incometaxTable;
  private _isCalculating = false;
  private _isPayed = false;
  private _payedDate = null;
  constructor(
    employees: any[],
    fromDate: Date,
    toDate: Date,
    socialTable: any[],
    holidayTable: any,
    exceptionsTable: any[],
    otherpayTable: any[],
    deductionsTable: any[],
    incometaxTable: any[],
  ) {
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.employees = employees;
    this.socialTable = socialTable;
    this.holidayTable = holidayTable;

    this.exceptionsTable = exceptionsTable;
    this.otherpayTable = otherpayTable;
    this.deductionsTable = deductionsTable;
    this.incometaxTable = incometaxTable;
  }

  public set employees(employees: any[]) {
    let allPayrollRows = [];
    employees.forEach(e => {
      e.fromDate = this.fromDate;
      e.toDate = this.toDate;
      e.holidayList = this.holidayTable;
      let newEmployee = new PayrollRow(
        e.employeeId,
        e.employee,
        e.firstName,
        e.middleName,
        e.lastName,
        e.socialSecurity,
        e.status,
        e.personal? (e.personal.emailAddress?e.personal.emailAddress: ''): '',
        e.payrollType,
        e.hourlyRate,
        e.employeeName,
        e.employeeCompany,
        e.employeePosition,
        e.employeePayroll,
        e.employeeShift,
        e.fromDate,
        e.toDate,
        e.holidayList
      );
      allPayrollRows.push(newEmployee);

      if (allPayrollRows.length === employees.length) {
        this._employees = allPayrollRows.sort( (a, b) => {
          return a.firstName.localeCompare(b.firstName)
        });
      }
    });
  }
  public get employees() {
    return this._employees;
  }

  public set fromDate(v: any) {
    this._fromDate = moment(v)
      .toDate();
  }
  public get fromDate(): any {
    return this._fromDate;
  }

  public set toDate(v: any) {
    this._toDate = moment(v)
      .toDate();
  }

  public get toDate(): any {
    return this._toDate;
  }

  public set holidayTable(v: any[]) {
    this._holidayTable = v;
  }

  public get holidayTable(): any[] {
    return this._holidayTable;
  }

  public set socialTable(v: any[]) {
    this._socialTable = v;
  }
  public get socialTable(): any[] {
    return this._socialTable;
  }

  public set exceptionsTable(v: any[]) {
    this._exceptionsTable = v;
  }
  public get exceptionsTable(): any[] {
    return this._exceptionsTable;
  }

  public set otherpayTable(v: any[]) {
    this._otherpayTable = v;
  }
  public get otherpayTable(): any[] {
    return this._otherpayTable;
  }

  public set deductionsTable(v: any[]) {
    this._deductionsTable = v;
  }
  public get deductionsTable(): any[] {
    return this._deductionsTable;
  }

  public set incometaxTable(v: any[]) {
    this._incometaxTable = v;
  }
  public get incometaxTable(): any[] {
    return this._incometaxTable;
  }

  calculatePayroll() {
    if(!this._isCalculating) {
      this._isCalculating = true;
      for (let i = 0; i < this.employees.length; i++) {
        const employee: PayrollRow = this.employees[i];
        employee.calculatePayrollRow(this.socialTable, this.holidayTable, this.incometaxTable);
        if (i === this.employees.length - 1) {
        }
      }
    }else {
      return;
    }
  }
  filterEmployeesError(){
    return this.employees.filter(i => {
      return
    })
  }
  clearPayroll(){
    this._isCalculating = false;
  }
  getEmployeeIds() {
    return this._employees.map(employee => employee.employeeId);
  }

  getEmployeeById(id){
    return this._employees.find( employee => employee.employee === id);
  }
  joinEmployee(table, param) {
    let arrayLength = this._employees.length;
    for (let i = 0; i < arrayLength; i++) {
      const employee = this._employees[i];
      if (param in employee === false) employee[param] = [];
      for (let e = 0; e < table.length; e++) {
        const item = table[e];
        if (employee.employee === item.employee) {
          if(param === 'hours' && employee[param].length < 7) {
            employee[param].push(item)
          }else if( param !== 'hours') {
            employee[param].push(item);
          }
        }
      }
    }
  }

  recalculateOnConceptsChange( employee: any) {
    let foundEmployee = this.getEmployeeById(employee);
    foundEmployee.calculateConceptsGrossAndNet(this.socialTable, this.incometaxTable);
  }
  onCalculating(){
    return this._isCalculating;
  }
}
