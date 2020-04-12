import * as moment from 'moment';

export class PayrollRow {
  // these properties are needed for object creation and are gotten from DB.

  employee;
  employeeId;
  firstName;
  middleName;
  lastName;
  socialSecurity;
  status;
  payrollType;
  hourlyRate;
  emailAddress;
  overtimeRate;
  employeeName;
  employeeCompany;
  employeePosition;
  employeePayroll;
  employeeShift;
  _fromDate: moment.Moment;
  _toDate: moment.Moment;
  regularHours = 45;
  wage = 0;
  // These properties are gotten later, not in object creation.
  _hours: any[] = [];
  overtime = 0;
  holiday: any[] = [];
  bonus: any[] = [];

  otherpay: any[] = [];
  csl: any[] = [];
  maternity: any[] = [];
  vacations: any[] = [];

  deductions = [];
  grossWage = 0;
  // Hours
  totalSystemHours: any = {};
  totalHolidayHours: any = {};
  totalOvertimeHours: any = {};

  // Moneys $$
  // regular shema
  // {
  //   hours: number;
  //   rate: number;
  //   totalPayed: number;
  // }
  totalRegularHoursPay: any = {
    hours: 0,
    rate: 0,
    totalPayed: 0,
  }; // MAX 45

  totalHolidayHoursPayX2: any = {
    hours: 0,
    rate: 0,
    totalPayed: 0,
  };
  totalHolidayHoursPayX1: any = {
    hours: 0,
    rate: 0,
    totalPayed: 0,
  };
  totalOvertimeHoursPay: any = {
    hours: 0,
    rate: 0,
    totalPayed: 0,
  };

  totalBonusPay = 0;
  totalOtherpay = 0; // Sickleaves, maternity leaves, vacations.
  totalDeductions = 0;
  socialSecurityEmployee = 0;
  socialSecurityEmployer = 0;
  incomeTax = 0;
  netWage = 0;
  constructor(
    employeeId: number,
    employee: string,
    firstName: string,
    middleName: string,
    lastName: string,
    socialSecurity: string,
    status: string,
    emailAddress: string,
    payrollType: string,
    hourlyRate: number,
    employeeName: string,
    employeeCompany: any,
    employeePosition: any,
    employeePayroll: any,
    employeeShift: any,
    fromDate: any,
    toDate: any,
    holidayList: any
  ) {
    this.employee = employee;
    this.employeeId = employeeId;
    this.firstName = firstName;
    this.middleName = middleName;
    this.lastName = lastName;
    this.socialSecurity = socialSecurity;
    this.status = status;
    this.emailAddress = emailAddress;
    this.payrollType = payrollType;
    this.hourlyRate = hourlyRate;
    this.employeeName = employeeName;
    this.employeeCompany = employeeCompany;
    this.employeePosition = employeePosition;
    this.employeePayroll = employeePayroll;
    this.employeeShift = employeeShift;
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.overtimeRate = hourlyRate * 1.5;
  }

  public set hours(v: any[]) {
    this._hours = v;
  }

  public get hours(): any[] {
    return this._hours;
  }

  public set fromDate(v: any) {
    this._fromDate = moment(v).hours(0);
  }
  public get fromDate(): any {
    return this._fromDate;
  }

  public set toDate(v: any) {
    this._toDate = moment(v);
  }

  public get toDate(): any {
    return this._toDate;
  }

  checkHours(arr: any[]): boolean {
    const uniqueArray = arr
      .map(function (date) {
        return date.getTime();
      })
      .filter(function (date, i, array) {
        return array.indexOf(date) === i;
      })
      .map(function (time) {
        return new Date(time);
      });

    if (uniqueArray.length < arr.length) {
      return false;
    } else {
      return true;
    }
  }

  calculateHolidays(holidayList: any[]) {
    return new Promise((res, rej) => {
      if (this.hours.length > 0 && holidayList.length > 0) {
        for (let i = 0; i < this.hours.length; i++) {
          const hourDate = this.hours[i].date;
          const momentHourDate = moment(hourDate);
          for (let e = 0; e < holidayList.length; e++) {
            const holidayDate = moment(holidayList[e].date).add('days', 1);
            if (moment(momentHourDate).isSame(moment(holidayDate), 'date')) {
              this.hours[i].holidayRate = holidayList[e].rate;
              this.holiday.push(this.hours[i]);
            }
          }
          if (i === this.hours.length - 1) {
            this.deleteHolidayRateHours(this.holiday);
            this.calculateHolidayPayment().then((result) => {
              res();
            });
          }
        }
      }
      res();
    });
  }

  deleteHolidayRateHours(list: any[]) {
    list.forEach((listItem) => {
      this.hours = this.hours.filter((i) => {
        return !moment(i.date).isSame(moment(listItem.date), 'date');
      });
    });
  }

  checkForHoliday(date, holidayList) {
    if (holidayList.length > 0) {
      for (let i = 0; i < holidayList.length; i++) {
        const element = holidayList[i];
        if (date.isSame(moment(element.date), 'day')) {
          return true;
        } else {
          return false;
        }
      }
    } else {
      return false;
    }
  }

  calculateHolidayPayment(): Promise<any> {
    return new Promise((res, rej) => {
      const totalX2 = {
        hours: 0,
        rate: 2 * this.hourlyRate,
        totalPayed: 0,
      };
      const totalX1 = {
        hours: 0,
        rate: 1.5 * this.hourlyRate,
        totalPayed: 0,
      };
      if (this.holiday.length > 0) {
        for (let i = 0; i < this.holiday.length; i++) {
          const day = this.holiday[i];
          const time = day.systemHours.hh * 3600 + day.systemHours.mm * 60 + day.systemHours.ss;
          const value = time / 3600;
          if (parseInt(day.holidayRate, 10) === 2) {
            totalX2.hours = totalX2.hours + value;
            totalX2.totalPayed = totalX2.hours * totalX2.rate;
          } else if (parseFloat(day.holidayRate) === 1.5) {
            totalX1.hours = totalX1.hours + value;
            totalX1.totalPayed = totalX1.hours * totalX1.rate;
          }
          if (this.holiday.length - 1 === i) {
            this.totalHolidayHoursPayX2 = totalX2;
            this.totalHolidayHoursPayX1 = totalX1;
            res();
          }
        }
      }
      res();
    });
  }

  calculateRegularHours(holidayList) {
    return new Promise((res, rej) => {
      const dif = moment.duration(this.toDate.diff(this.fromDate)).asDays();
      const sum = 0;
      for (let i = 0; i < dif; i++) {
        const localizedDate = this.fromDate;
        localizedDate.add(i, 'days').toDate();
        const dayOfWeek = localizedDate.day() === 0 ? 6 : localizedDate.day() - 1;

        if (
          this.employeeShift !== null &&
          this.employeeShift.shift[dayOfWeek].onShift &&
          this.checkForHoliday(localizedDate, holidayList)
        ) {
          const shiftElement = this.employeeShift.shift[dayOfWeek];
          const hoursWorked = (shiftElement.endTime - shiftElement.startTime) / 60;
          this.regularHours = this.regularHours - hoursWorked;
        }
        localizedDate.subtract(i, 'days').toDate();
        this.wage = this.regularHours * this.hourlyRate;
      }
      res();
    });
  }

  calculateSystemHours() {
    return new Promise((res, rej) => {
      if (this.hours.length > 7) {
        rej(this);
      }
      const totaled = this.calculateTotalHours(this.hours);
      this.totalSystemHours = totaled;

      const hh = this.totalSystemHours.value >= this.regularHours ? this.regularHours : this.totalSystemHours.value;

      const obj = {
        hours: hh,
        rate: this.hourlyRate,
        totalPayed: hh * this.hourlyRate,
      };
      this.totalRegularHoursPay = obj;
      res();
    });
  }

  calculateOvertimeHours() {
    return new Promise((res, rej) => {
      if (this.totalSystemHours.value >= 45) {
        this.overtime = this.totalSystemHours.value - this.regularHours;
        const time = this.overtime * 3600;
        const hrs = ~~(time / 3600);
        const mins = ~~((time % 3600) / 60);
        const secs = ~~time % 60;
        let ret = '';
        if (hrs > 0) {
          ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
        }

        ret += '' + mins + ':' + (secs < 10 ? '0' : '');
        ret += '' + secs;
        this.totalOvertimeHoursPay = {
          valueString: ret,
          hours: this.overtime,
          rate: this.overtimeRate,
          totalPayed: this.overtime * this.overtimeRate,
        };
      }
      res();
    });
  }

  calculateTotalOtherpay() {
    return new Promise((res, rej) => {
      if (this.otherpay.length > 0) {
        if (this.otherpay.length === 1) {
          this.totalOtherpay = this.otherpay[0].amount;
          res(this.totalOtherpay);
        }
        if (this.otherpay.length > 1) {
          const sum = this.otherpay.reduce((x, y) => x + y.amount, 0);
          this.totalOtherpay = sum;
          res(this.totalOtherpay);
        }
        res();
      }
      res();
    });
  }

  calculateTotalBonuses() {
    return new Promise((res, rej) => {
      if (this.bonus.length === 1) {
        this.totalBonusPay = this.bonus[0].amount;
        res(this.totalBonusPay);
      }
      if (this.bonus.length > 1) {
        const sum = this.bonus.reduce((x, y) => x + y.amount, 0);
        this.totalBonusPay = sum;
        res(this.totalBonusPay);
      }
      res();
    });
  }

  calculateTotalDeductions() {
    return new Promise((res, rej) => {
      if (this.deductions.length === 1) {
        this.totalDeductions = this.deductions[0].amount;
        res();
      }
      if (this.deductions.length > 1) {
        const sum = this.deductions.reduce((x, y) => x + y.amount, 0);
        this.totalDeductions = sum;
        res();
      }
      res(this.totalDeductions);
    });
  }

  calculateTotalSocialSecurity(socialTable) {
    return new Promise((res, rej) => {
      for (let i = 0; i < socialTable.length; i++) {
        const social = socialTable[i];
        const upperLimit = socialTable[i + 1] !== undefined ? socialTable[i + 1].earnings : this.grossWage + 1;
        const identifier = this.grossWage - this.totalOtherpay;
        if (this.totalSystemHours >= 8 || this.grossWage - this.totalOtherpay >= this.hourlyRate * 8) {
          if (identifier > social.earnings && identifier < upperLimit) {
            this.socialSecurityEmployer = social.employerDeductions;
            this.socialSecurityEmployee = social.employeeDeductions;
            res(social);
          }
        }
      }
      res();
    });
  }

  calculateTotalIncomeTax(incometaxTable: any[]) {
    return new Promise((res, rej) => {
      const earnings = this.grossWage;
      if (earnings > 500) {
        let value;
        for (let i = 0; i < incometaxTable.length; i++) {
          const tax = incometaxTable[i];
          const earn = Math.round(100 * earnings) / 100;
          if (earn >= tax.fromAmount && earn < tax.toAmount + 0.1) {
            value = tax;
            break;
          }
        }
        if (!value) {
          console.log(value);
        }
        this.incomeTax = value.taxAmount;
        res(value);
      } else {
        this.incomeTax = 0;
        res(0);
      }
    });
  }

  calculateGrossWage() {
    return new Promise((res, rej) => {
      this.grossWage =
        this.totalRegularHoursPay.totalPayed +
        this.totalOvertimeHoursPay.totalPayed +
        this.totalHolidayHoursPayX1.totalPayed +
        this.totalHolidayHoursPayX2.totalPayed +
        this.totalBonusPay +
        this.totalOtherpay;

      res(this.grossWage);
    });
  }

  calculateTotalPayment() {
    return new Promise((res, rej) => {
      this.netWage =
        this.grossWage -
        this.socialSecurityEmployee -
        this.socialSecurityEmployer -
        this.incomeTax -
        this.totalDeductions;

      res(this.netWage);
    });
  }

  calculatePayrollRow(socialTable, holidayTable, incometaxTable) {
    if (this.payrollType.toLowerCase() === 'bi-weekly') {
      const tasks = [
        this.calculateHolidays(holidayTable),
        this.calculateRegularHours(holidayTable),
        this.calculateSystemHours(),
        this.calculateOvertimeHours(),
        this.calculateTotalBonuses(),
        this.calculateTotalOtherpay(),
        this.calculateGrossWage(),
        this.calculateTotalDeductions(),
        this.calculateTotalSocialSecurity(socialTable),
        this.calculateTotalIncomeTax(incometaxTable),
        this.calculateTotalPayment(),
      ];
      return tasks
        .reduce((promiseChain, currentTask) => {
          return promiseChain.then((chainResults: any) =>
            currentTask.then((currentResult) => [...chainResults, currentResult])
          );
        }, Promise.resolve([]))
        .then((arrayOfResults) => {});
    } else if (this.payrollType.toLowerCase() === 'semimonthly') {
      return null;
    } else {
      return null;
    }
  }

  calculateConceptsGrossAndNet(socialTable, incometaxTable) {
    console.log('invoked');
    const tasks = [
      this.calculateTotalBonuses(),
      this.calculateTotalOtherpay(),
      this.calculateGrossWage(),
      this.calculateTotalDeductions(),
      this.calculateTotalSocialSecurity(socialTable),
      this.calculateTotalIncomeTax(incometaxTable),
      this.calculateTotalPayment(),
    ];
    return tasks
      .reduce((promiseChain, currentTask) => {
        return promiseChain.then((chainResults: any) =>
          currentTask.then((currentResult) => [...chainResults, currentResult])
        );
      }, Promise.resolve([]))
      .then((arrayOfResults) => {})
      .catch((error) => {
        console.log(error);
      });
  }

  calculateTotalHours(arr: any[]) {
    if (arr.length > 0) {
      const totaled: any = {
        hh: Number,
        mm: Number,
        ss: Number,
      };
      totaled.hh = arr.reduce((p, c) => p + c.systemHours.hh, 0);
      totaled.mm = arr.reduce((p, c) => p + c.systemHours.mm, 0);
      totaled.ss = arr.reduce((p, c) => p + c.systemHours.ss, 0);
      totaled.hh = totaled.hh + arr.reduce((p, c) => p + c.tosHours.hh, 0);
      totaled.mm = totaled.mm + arr.reduce((p, c) => p + c.tosHours.mm, 0);
      totaled.ss = totaled.ss + arr.reduce((p, c) => p + c.tosHours.ss, 0);
      const time = totaled.hh * 3600 + totaled.mm * 60 + totaled.ss;
      const hrs = ~~(time / 3600);
      const mins = ~~((time % 3600) / 60);
      const secs = ~~time % 60;
      let ret = '';

      if (hrs > 0) {
        ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
      }

      ret += '' + mins + ':' + (secs < 10 ? '0' : '');
      ret += '' + secs;
      const correctedTotal = {
        hh: hrs,
        mm: mins,
        ss: secs,
        value: time / 3600,
        valueString: ret,
      };
      return correctedTotal;
    } else {
      const finished = {
        hh: 0,
        mm: 0,
        ss: 0,
        value: 0,
        valueString: '00:00:00',
      };
      return finished;
    }
  }
}
