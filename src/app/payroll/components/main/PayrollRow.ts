import { ReturnStatement } from "@angular/compiler";

export class PayrollRow {
  // these properties are needed for object creation and are gotten from DB.

  socialSecurityTable = [
    {
      earnings: 0,
      employeeDeductions: 0,
      employerDeductions: 0,
      totalContributions: 0
    },
    {
      earnings: 1,
      employerDeductions: 3.57,
      employeeDeductions: 0.83,
      totalContributions: 4.4
    },
    {
      earnings: 70,
      employerDeductions: 5.85,
      employeeDeductions: 1.35,
      totalContributions: 7.2
    },
    {
      earnings: 110,
      employerDeductions: 8.45,
      employeeDeductions: 1.95,
      totalContributions: 10.4
    },
    {
      earnings: 140,
      employerDeductions: 9.65,
      employeeDeductions: 3.15,
      totalContributions: 12.8
    },
    {
      earnings: 180,
      employerDeductions: 11.25,
      employeeDeductions: 4.75,
      totalContributions: 16
    },
    {
      earnings: 220,
      employerDeductions: 12.85,
      employeeDeductions: 6.35,
      totalContributions: 19.2
    },
    {
      earnings: 260,
      employerDeductions: 14.45,
      employeeDeductions: 7.95,
      totalContributions: 22.4
    },
    {
      earnings: 300,
      employerDeductions: 16.05,
      employeeDeductions: 9.55,
      totalContributions: 25.6
    }
  ];
  employee;
  employeeId;
  firstName;
  middleName;
  lastName;
  socialSecurity;
  status;
  payrollType;
  hourlyRate;
  overtimeRate;
  employeeName;
  employeeCompany;
  employeePosition;
  employeePayroll;
  fromDate;
  toDate;

  //Need to know how is regular hours calculated;
  regularHours = 45;
  wage = 0;
  //These properties are gotten later, not in object creation.
  _hours = [];
  overtime = [];
  holiday = [];
  bonus = [];

  otherpay = [];
  csl = [];
  maternity = [];
  vacations = [];

  deductions = [];
  grossWage = 0; //Payable hours * hourlyRate
  //Hours
  totalSystemHours: any = {};
  totalHolidayHours: any = {};
  totalOvertimeHours: any = {};

  //Moneys $$
  // regular shema
  // {
  //   hours: number;
  //   rate: number;
  //   totalPayed: number;
  // }
  totalRegularHoursPay = {}; //MAX 45
  totalHolidayHoursPayX2 = {};
  totalHolidayHoursPayX1 = {};
  totalOvertimeHoursPay = {};
  totalBonusPay = 0;
  totalOtherpay = 0; // Sickleaves, maternity leaves, vacations.
  totalDeductions = 0;
  socialSecurityEmployee = 0;
  socialSecurityEmployer = 0;
  netWage = {};
  constructor(
    employeeId: number,
    employee: string,
    firstName: string,
    middleName: string,
    lastName: string,
    socialSecurity: string,
    status: string,
    payrollType: string,
    hourlyRate: number,
    employeeName: string,
    employeeCompany: any,
    employeePosition: any,
    employeePayroll: any,
    fromDate: Date,
    toDate: Date
  ) {
    this.employee = employee;
    this.employeeId = employeeId;
    this.firstName = firstName;
    this.middleName = middleName;
    this.lastName = lastName;
    this.socialSecurity = socialSecurity;
    this.status = status;
    this.payrollType = payrollType;
    this.hourlyRate = hourlyRate;
    this.employeeName = employeeName;
    this.employeeCompany = employeeCompany;
    this.employeePosition = employeePosition;
    this.employeePayroll = employeePayroll;
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.overtimeRate = hourlyRate * 1.5;
    this.wage = hourlyRate * this.regularHours;
    this.calculateTotalSocialSecurity();
  }

  public set hours(v: any[]) {
    if (this.checkHours(v)) {
      this._hours = v;
    } else {
      throw "There is duplicate dates on the hour registry.";
    }
  }

  public get hours(): any[] {
    return this._hours;
  }

  checkHours(arr: any[]): boolean {
    let uniqueArray = arr
      .map(function(date) {
        return date.getTime();
      })
      .filter(function(date, i, array) {
        return array.indexOf(date) === i;
      })
      .map(function(time) {
        return new Date(time);
      });

    if (uniqueArray.length < arr.length) {
      return false;
    } else return true;
  }
  calculateGrossWage() {}

  calculateHolidays(holidayList: any[]) {
    if (this._hours.length > 0 && holidayList.length > 0) {
      for (let i = 0; i < this._hours.length; i++) {
        const hourDate = this._hours[i].date;
        for (let e = 0; e < holidayList.length; e++) {
          const holidayDate = holidayList[e].date;
          if (this.dates.compare(hourDate, holidayDate) === 0) {
            this._hours[i].holidayRate = holidayList[e].rate;
            this.holiday.push(this._hours[i]);
            delete this._hours[i];
          }
        }
        if (i === this._hours.length - 1) {
          this.calculateHolidayPayment();
        }
      }
    }
  }

  calculateHolidayPayment(): void {
    let totalX2 = 0;
    let totalX1 = 0;
    if (this.holiday.length > 0) {
      for (let i = 0; i < this.holiday.length; i++) {
        const day = this.holiday[i];
        let time = day.hh * 3600 + day.mm * 60 + day.ss;
        let value = time / 3600;
        let payed = day.holidayRate * value;
        day.totalPay = payed;
        if (parseInt(day.holidayRate, 10) === 2) {
          totalX2 = totalX2 + payed;
        } else if (parseInt(day.holidayRate, 10) === 1.5) {
          totalX1 = totalX1 + payed;
        }
        if (this.holiday.length - 1 === i) {
          this.totalHolidayHoursPayX2 = totalX2;
          this.totalHolidayHoursPayX1 = totalX1;
        }
      }
    }
  }
  calculateTotalHours(arr: any[]) {
    if (arr.length > 0) {
      let totaled: any = {};
      totaled.hh = arr.reduce((p, c) => p + c.systemHours.hh, 0);
      totaled.mm = arr.reduce((p, c) => p + c.systemHours.mm, 0);
      totaled.ss = arr.reduce((p, c) => p + c.systemHours.ss, 0);

      let time = totaled.hh * 3600 + totaled.mm * 60 + totaled.ss;
      var hrs = ~~(time / 3600);
      var mins = ~~((time % 3600) / 60);
      var secs = ~~time % 60;
      var ret = "";

      if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
      }

      ret += "" + mins + ":" + (secs < 10 ? "0" : "");
      ret += "" + secs;
      let correctedTotal = {
        hh: hrs,
        mm: mins,
        ss: secs,
        value: time / 3600,
        valueString: ret
      };
      return correctedTotal;
    } else {
      let finished = {
        hh: 0,
        mm: 0,
        ss: 0,
        value: 0,
        valueString: "00:00:00"
      };
      return finished;
    }
  }

  calculateSystemHours() {
    let totaled = this.calculateTotalHours(this._hours);
    this.totalSystemHours = totaled;
  }
  calculateOvertimeHours(): void {
    let totaled = this.calculateTotalHours(this.overtime);
    this.totalOvertimeHours = totaled;
    this.calculateOvertimePay();
  }

  calculateOvertimePay() {
    if (this.totalOvertimeHours.value !== undefined) {
      let overtime = this.totalOvertimeHours.value;
      let returnObj = {
        hours: overtime,
        rate: this.overtimeRate,
        totalPayed: overtime * this.overtimeRate
      };
      this.totalOvertimeHoursPay = returnObj;
      return;
    }
  }

  calculateTotalDeductions() {
    if (this.deductions.length > 0) {
      let sum = this.deductions.reduce((x, y) => x.amount + y.amount);
      this.totalDeductions = sum;
    }
  }

  calculateTotalOtherpay() {
    if (this.otherpay.length > 0) {
      for (let i = 0; i < this.otherpay.length; i++) {
        const element = this.otherpay[i];
        switch (element.reason) {
          case "CSL":
            this.csl.push(element);
            break;
          case "MATERNITY":
            this.maternity.push(element);
            break;
          case "VACATIONS":
            this.vacations.push(element);
            break;
          default:
            break;
        }
      }
      let sum = this.otherpay.reduce((x, y) => x.amount + y.amount);
      this.totalOtherpay = sum;
    }
  }

  calculateTotalBonuses() {
    if (this.bonus.length > 0) {
      let sum = this.bonus.reduce((x, y) => x.amount + y.amount);
      this.totalBonusPay = sum;
    }
  }

  calculateTotalPayment() {}

  calculateTotalSocialSecurity() {
    for (let i = 0; i < this.socialSecurityTable.length; i++) {
      const social = this.socialSecurityTable[i];
      const upperLimit =
        this.socialSecurityTable[i + 1] !== undefined
          ? this.socialSecurityTable[i + 1].earnings
          : 0;
      const identifier = this.grossWage - this.totalOtherpay;
      if (
        this.totalSystemHours >= 8 ||
        this.grossWage - this.totalOtherpay >= this.hourlyRate * 8
      ) {
        if (identifier > social.earnings && identifier < upperLimit) {
          this.socialSecurityEmployer = social.employerDeductions;
          this.socialSecurityEmployee = social.employeeDeductions;
        }
      } else {
        break;
      }
    }
  }

  calculateWorkableDays() {}

  dates = {
    convert: function(d) {
      // Converts the date in d to a date-object. The input can be:
      //   a date object: returned without modification
      //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
      //   a number     : Interpreted as number of milliseconds
      //                  since 1 Jan 1970 (a timestamp)
      //   a string     : Any format supported by the javascript engine, like
      //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
      //  an object     : Interpreted as an object with year, month and date
      //                  attributes.  **NOTE** month is 0-11.
      return d.constructor === Date
        ? d
        : d.constructor === Array
        ? new Date(d[0], d[1], d[2])
        : d.constructor === Number
        ? new Date(d)
        : d.constructor === String
        ? new Date(d)
        : typeof d === "object"
        ? new Date(d.year, d.month, d.date)
        : NaN;
    },
    compare: function(a: any, b: any) {
      // Compare two dates (could be of any type supported by the convert
      // function above) and returns:
      //  -1 : if a < b
      //   0 : if a = b
      //   1 : if a > b
      // NaN : if a or b is an illegal date
      // NOTE: The code inside isFinite does an assignment (=).
      return isFinite((a = this.convert(a).valueOf())) &&
        isFinite((b = this.convert(b).valueOf()))
        ? +(a > b) - +(a < b)
        : NaN;
    },
    inRange: function(d, start, end) {
      // Checks if date in d is between dates in start and end.
      // Returns a boolean or NaN:
      //    true  : if d is between start and end (inclusive)
      //    false : if d is before start or after end
      //    NaN   : if one or more of the dates is illegal.
      // NOTE: The code inside isFinite does an assignment (=).
      return isFinite((d = this.convert(d).valueOf())) &&
        isFinite((start = this.convert(start).valueOf())) &&
        isFinite((end = this.convert(end).valueOf()))
        ? start <= d && d <= end
        : NaN;
    }
  };
}
