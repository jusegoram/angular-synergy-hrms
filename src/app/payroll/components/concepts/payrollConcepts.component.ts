import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-deduction',
  templateUrl: './payrollConcepts.component.html',
  styleUrls: ['./payrollConcepts.component.scss']
})
export class PayrollConceptsComponent implements OnInit {
  public title: string;
  employee: any = {
    bonus: [],
    csl: [],
    deductions: [],
    employee: '5c2191520ea28576e05fff3e',
    employeeCompany: { employee: '5c2191520ea28576e05fff3e', reapplicantTimes: null, reapplicant: null, terminationDate: null, hireDate: '2018-04-09T06:00:00.000Z' },
    employeeId: 37542,
    employeeName: 'Maudeline Duce Westby',
    employeePayroll: { employee: '5c2191520ea28576e05fff3e', billable: true, bankAccount: '211791051', bankName: 'Atlantic Bank', baseWage: '1560' },
    employeePosition: { _id: '5c37f836efc3c8b3e2b731c2', positionId: 'PR003', name: 'CSE8', baseWage: 1560, __v: 0 },
    employeeShift: null,
    firstName: 'Maudeline',
    grossWage: 492.96,
    holiday: [],
    holidayList: [],
    hourlyRate: 8,
    incomeTax: 0,
    lastName: 'Westby',
    maternity: [],
    middleName: 'Duce',
    netWage: 467.35999999999996,
    otherpay: [],
    overtime: 11.079999999999998,
    overtimeRate: 12,
    payrollType: 'BI-WEEKLY',
    regularHours: 45,
    socialSecurity: '183018',
    socialSecurityEmployee: 9.55,
    socialSecurityEmployer: 16.05,
    socialSecurityTable: [],
    status: 'active',
    totalBonusPay: 0,
    totalDeductions: 0,
    totalHolidayHours: {},
    totalHolidayHoursPayX1: { hours: 0, rate: 0, totalPayed: 0 },
    totalHolidayHoursPayX2: { hours: 0, rate: 0, totalPayed: 0 },
    totalOtherpay: 0,
    totalOvertimeHours: {},
    totalOvertimeHoursPay: { valueString: '11:04:47', hours: 11.079999999999998, rate: 12, totalPayed: 132.95999999999998 },
    totalRegularHoursPay: { hours: 45, rate: 8, totalPayed: 360 },
    totalSystemHours: { hh: 56, mm: 4, ss: 48, value: 56.08, valueString: '56:04:48' },
    vacations: [],
    wage: 360,
    _fromDate: 'Sun Apr 14 2019 00:00:00 GMT-0600 (Central Standard Time)',
    _hours: [],
    _toDate: 'Sun Apr 21 2019 23:59:59 GMT-0600 (Central Standard Time)',
  };

  constructor() {
    this.title = `${this.employee.employeeName}'s Payroll Concepts`;
  }

  ngOnInit() {
  }

}
