import { PayrollRow } from './PayrollRow';
import { map } from "rxjs/operators";
import { PayrollService } from "./../../services/payroll.service";
import {
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material";
import * as XLSX from "xlsx";
import * as moment from "moment";
import { Payroll } from './Payroll';

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"]
})
export class MainComponent implements OnInit {
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
      totalContributions: 4.40,
    },
    {
      earnings: 70,
      employerDeductions: 5.85,
      employeeDeductions: 1.35,
      totalContributions: 7.20
    },
    {
      earnings: 110,
      employerDeductions: 8.45,
      employeeDeductions: 1.95,
      totalContributions: 10.40
    },
    {
      earnings: 140,
      employerDeductions: 9.65,
      employeeDeductions: 3.15,
      totalContributions: 12.80
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
      totalContributions: 19.20
    },
    {
      earnings: 260,
      employerDeductions: 14.45,
      employeeDeductions: 7.95,
      totalContributions: 22.40
    },
    {
      earnings: 300,
      employerDeductions: 16.05,
      employeeDeductions: 9.55,
      totalContributions: 25.60
    }
  ];
  dataSource: any;
  payroll: Payroll;
  deductions: any;
  bonus: any;
  hours: any;
  businesDays: number;

  payrollType = new FormControl("", [Validators.required]);
  fromDate = new FormControl("", [this.dateMinimum(moment().add( -10,"days"))]);
  toDate = new FormControl("", [this.dateMaximum(this.fromDate.value)]);
  lastPayrollSettings: any;
  currentPayrollSettings: any;
  dataSourceSocialTable: any;
  socialTableDisplayedColumns: string[] = [];
  displayedColumns = ["employeeId"];
  constructor(private _payrollService: PayrollService) {}

  ngOnInit() {
    this.dataSourceSocialTable = new MatTableDataSource(this.socialSecurityTable);
    this.socialTableDisplayedColumns = Object.keys(
      this.dataSourceSocialTable.data[0]
    );
  }

  populateTable(data) {
    this.dataSource = new MatTableDataSource(data);
  }
  loadOtherPayrollInfo(payroll, from, to) {
    let employeeIds = this.payroll.employees.map(i => i.employee);
    this._payrollService
      .getOtherPayrollInfo(employeeIds, payroll, from, to)
      .subscribe((result: any[]) => {
        let hours = result[0];
        let overtime = result[1];
        let bonus = result[2];
        let deductions = result[3];
        let otherpay = result[4];
        this.payroll.joinEmployee(hours, "hours");
        this.payroll.joinEmployee(overtime, "overtime");
        this.payroll.joinEmployee(bonus, "bonus");
        this.payroll.joinEmployee(deductions, "deductions");
        this.payroll.joinEmployee(otherpay, "otherpay");
      });
  }
  loadPayrollType(payroll, from, to) {
    this._payrollService
      .getEmployeesByPayrollType(payroll, from, to)
      .subscribe((result: PayrollRow[]) => {
        this.payroll = new Payroll(result, from, to);
        this.populateTable(this.payroll.employees);
      });
  }
  onLoadBonus(e) {
    let files = e.target.files,
      f = files[0];
    let reader = new FileReader();
    let jsonSheet;
    reader.onload = (e: any) => {
      let data = new Uint8Array(e.target.result);
      let workbook = XLSX.read(data, { type: "array" });

      let first_sheet_name = workbook.SheetNames[0];

      let worksheet = workbook.Sheets[first_sheet_name];
      jsonSheet = XLSX.utils.sheet_to_json(worksheet, {
        raw: true
      });
    };
    reader.readAsArrayBuffer(f);
    setTimeout(() => {
      this.populateTable(this.payroll.joinEmployee(jsonSheet, 'bonus'));
    }, 500);
  }

  onLoadDeductions(e) {
    let files = e.target.files,
      f = files[0];
    let reader = new FileReader();
    let jsonSheet;
    reader.onload = (e: any) => {
      let data = new Uint8Array(e.target.result);
      let workbook = XLSX.read(data, { type: "array" });

      let first_sheet_name = workbook.SheetNames[0];

      let worksheet = workbook.Sheets[first_sheet_name];
      jsonSheet = XLSX.utils.sheet_to_json(worksheet, {
        raw: true
      });
    };
    reader.readAsArrayBuffer(f);
    setTimeout(() => {
      console.log(jsonSheet);
      this.populateTable(this.payroll.joinEmployee(jsonSheet, 'deductions'));
    }, 500);
  }

  dateMinimum(date: moment.Moment): ValidatorFn {
    const FORMAT_DATE = "DD/MM/YYYY";
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value == null) return null;

      const controlDate = moment(control.value, FORMAT_DATE);
      if (!controlDate.isValid()) return null;

      const validationDate = date;
      return controlDate.isAfter(validationDate)
        ? null
        : {
            "date-minimum": {
              "date-minimum": validationDate.format(FORMAT_DATE),
              actual: controlDate.format(FORMAT_DATE)
            }
          };
    };
  }

  dateMaximum(date: string): ValidatorFn {
    const FORMAT_DATE = "DD/MM/YYYY";
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value == null) return null;

      const controlDate = moment(control.value, FORMAT_DATE);
      if (!controlDate.isValid()) return null;

      const validationDate = moment(this.fromDate.value, FORMAT_DATE).add(
        7,
        "days"
      );
      return controlDate.isBefore(validationDate)
        ? null
        : {
            "date-max": {
              "date-max": validationDate.format(FORMAT_DATE),
              actual: controlDate.format(FORMAT_DATE)
            }
          };
    };
  }

  calculatePayroll() {
    // for (let i = 0; i < this.employees.length; i++) {
    //   const element = this.employees[i];
    //   if(element.hours.length > 0) {
    //     element.totalSystemHours = this.getTotalHours(element.hours);


    //     element.grossWage = element.totalSystemHours.value * element.hourlyRate
    //   }
    //   if(i === this.employees.length - 1) {this.populateTable(this.employees)
    //   console.log(this.employees);
    //   };
    // }
  }
  //migrated
  // getTotalHours = arr => {
  //   if (arr.length > 0) {
  //     let totaled:any = {};
  //     totaled.hh = arr.reduce((p, c) => p + c.systemHours.hh, 0);
  //     totaled.mm = arr.reduce((p, c) => p + c.systemHours.mm, 0);
  //     totaled.ss = arr.reduce((p, c) => p + c.systemHours.ss, 0);

  //     let time = totaled.hh * 3600 + totaled.mm * 60 + totaled.ss;
  //     var hrs = ~~(time / 3600);
  //     var mins = ~~((time % 3600) / 60);
  //     var secs = ~~time % 60;
  //     var ret = "";

  //     if (hrs > 0) {
  //       ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
  //     }

  //     ret += "" + mins + ":" + (secs < 10 ? "0" : "");
  //     ret += "" + secs;
  //     let correctedTotal = {
  //       hh: hrs,
  //       mm: mins,
  //       ss: secs,
  //       value: time / 3600,
  //       valueString: ret
  //     };
  //     return correctedTotal;
  //   } else {
  //     let finished = {
  //       hh: 0,
  //       mm: 0,
  //       ss: 0,
  //       value: 0,
  //       valueString: "00:00:00"
  //     };
  //     return finished;
  //   }
  // };
}
