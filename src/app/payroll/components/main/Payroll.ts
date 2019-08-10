import { PayrollRow } from "../main/PayrollRow";
import * as moment from "moment";


export class Payroll {
  private _employees: PayrollRow[] = [];
  private _holidays:any[] = [];
  private _fromDate;
  private _toDate;
  constructor(employees: any[], fromDate: Date, toDate: Date, holidays: any) {
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.holidays = holidays;
    this.employees = employees

  }

  public set employees(employees: any[]) {
    let allPayrollRows = [];
    employees.forEach(e => {
      e.fromDate = this.fromDate;
      e.toDate = this.toDate;
      e.holidayList = this.holidays;
      let newEmployee = new PayrollRow(
        e.employeeId,
        e.employee,
        e.firstName,
        e.middleName,
        e.lastName,
        e.socialSecurity,
        e.status,
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
      )
      allPayrollRows.push(newEmployee);

      if(allPayrollRows.length === employees.length) {
        this._employees = allPayrollRows;
      }
    });
    console.log(this._employees);
  }
  public get employees() {
    return this._employees;
  }


  public set fromDate(v : any) {
    this._fromDate = moment(v).startOf('day').toDate();
  }
  public get fromDate() : any {
    return this._fromDate;
  }


  public set toDate(v : any) {
    this._toDate = moment(v).endOf('day').toDate();
  }

  public get toDate() : any {
    return this._toDate;
  }


  public set holidays(v : any[] ) {
    this._holidays = v;
  }

  public get holidays() : any[] {
    return this._holidays;
  }


  calculatePayroll() {
    for (let i = 0; i < this.employees.length; i++) {
      const employee: PayrollRow= this.employees[i];
      employee.calculatePayrollRow();
      if(i === this.employees.length - 1){
        console.log(this.employees);
      }
    }
  }

  getEmployeeIds(){

  }


  joinEmployee(table, param) {
    let arrayLength = this._employees.length;
    for (let i = 0; i < arrayLength; i++) {
      const employee = this._employees[i];
      if (param in employee === false) employee[param] = [];
      for (let e = 0; e < table.length; e++) {
        const item = table[e];
        if (employee.employee === item.employee) {
          employee[param].push(item);
        }
      }
    }
  }
}
