import { map } from 'rxjs/operators';
import { PayrollService } from "./../../services/payroll.service";
import { FormControl } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material";
import * as XLSX from "xlsx";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"]
})
export class MainComponent implements OnInit {
  dataSource: any;
  employees: any;
  deductions: any;
  bonus: any;
  hours: any;
  // testEmployee = [{
  //   employeeId: 123456,
  //   employeeName: 'test test test',
  //   client: 'RCC',
  //   campaign: 'Icon',
  //   netPayment: 2000,
  //   deductions: 10,
  //   bonuses: 10,
  //   totalPayment: 10,
  //   date: new Date(),
  // }];
  payrollType = new FormControl('');
  fromDate = new FormControl('');
  toDate = new FormControl('');

  displayedColumns = ["employeeId"];
  constructor(private _payrollService: PayrollService) {}

  ngOnInit() {}

  populateTable(data) {
    this.dataSource = new MatTableDataSource(data);
  }

  loadPayrollType(payroll, from, to) {
    this._payrollService
      .getEmployeesByPayrollType(payroll, from, to)
      .subscribe(result => {
        this.employees = result;
        this.populateTable(result);
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
      this.populateTable(this.joinBonusAndEmployee(jsonSheet, this.employees));
    }, 500);
  }

  joinBonusAndEmployee(bnus, emp){
    var array1 = bnus,
    array2 = emp,
    map = array1.reduce((m, o) => m.set(o.employeeId, o), new Map()),
    array3 = array2.reduce((r, o) => {
      if (map.has(o.employeeId)) {
        o.bonus = [];
        o.bonus.push(map.get(o.employeeId));
        r.push(o);
      }else {
        r.push(o);
      }
      return r;
    }, []);

    let totaledArray = array3.map(e => {
      if('bonus' in e) {
        let mappedBonus = e.bonus.map(b => b.amount);
        e.totalBonus = parseInt(mappedBonus.reduce((partial_sum, a) => partial_sum + a), 10);
      }
      return e;
    })
    return totaledArray;
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

  }

    onLoadHours(from, to) {
      this._payrollService.getHours(from, to).subscribe(result => {
        this.hours = result;
      })
    }
}
