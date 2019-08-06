import { PayrollRow } from "../main/PayrollRow";

export class Payroll {
  private _employees: PayrollRow[] = [];
  private _holidays:any[] = [];
  private _fromDate;
  private _toDate;
  constructor(employees: any[], fromDate: Date, toDate: Date,) {
    this.employees = employees
    this.fromDate = fromDate;
    this.toDate = toDate;
  }

  public set employees(employees: any[]) {
    let allPayrollRows = [];
    employees.forEach(e => {
      e.fromDate = this.fromDate;
      e.toDate = this.toDate;
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
        e.fromDate,
        e.toDate,
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


  public set fromDate(v : Date) {
    this._fromDate = v;
  }
  public get fromDate() : Date {
    return this._fromDate;
  }


  public set toDate(v : Date) {
    this._toDate = v;
  }

  public get toDate() : Date {
    return this._toDate;
  }


  public set holidays(v : any[] ) {
    this._holidays = v;
  }

  public get holidays() : any[] {
    return this._holidays;
  }


  calculatePayroll() {
    this.employees.forEach((employee: PayrollRow) => {
      employee.calculateHolidays(this._holidays);
      employee.calculateSystemHours();
      employee.calculateOvertimeHours();
      employee.calculateTotalOtherpay();
      employee.calculateTotalBonuses();
      employee.calculateTotalDeductions();
      employee.calculateTotalSocialSecurity();
      employee.calculateTotalPayment();
    })
  }
  getEmployeeIds(){

  }
  // joinBonusUploadAndEmployee(bnus) {
  //   var array1 = bnus,
  //     array2 = this._employees,
  //     map = array1.reduce((m, o) => m.set(o.employeeId, o), new Map()),
  //     array3 = array2.reduce((r, o) => {
  //       if (map.has(o.employeeId)) {
  //         o.bonus = [];
  //         o.bonus.push(map.get(o.employeeId));
  //         r.push(o);
  //       } else {
  //         r.push(o);
  //       }
  //       return r;
  //     }, []);

  //   let totaledArray = array3.map(e => {
  //     if ("bonus" in e) {
  //       let mappedBonus = e.bonus.map(b => b.amount);
  //       e.totalBonus = parseInt(
  //         mappedBonus.reduce((partial_sum, a) => partial_sum + a),
  //         10
  //       );
  //     }
  //     return e;
  //   });

  //   return totaledArray;
  // }

  // joinDeductionsUploadAndEmployee(deductions) {
  //   var array1 = deductions,
  //     array2 = this._employees,
  //     map = array1.reduce((m, o) => m.set(o.employeeId, o), new Map()),
  //     array3 = array2.reduce((r, o) => {
  //       if (map.has(o.employeeId)) {
  //         o.deductions = [];
  //         o.deductions.push(map.get(o.employeeId));
  //         r.push(o);
  //       } else {
  //         r.push(o);
  //       }
  //       return r;
  //     }, []);

  //   let totaledArray = array3.map(e => {
  //     if ("deductions" in e) {
  //       let mappedDeductions = e.deductions.map(b => b.amount);
  //       e.totalBonus = parseInt(
  //         mappedDeductions.reduce((partial_sum, a) => partial_sum + a),
  //         10
  //       );
  //     }
  //     return e;
  //   });

  //   return totaledArray;
  // }

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
