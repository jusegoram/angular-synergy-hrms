import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  data: any;
  constructor(private employeeService: EmployeeService) { }
  ngOnInit() {
  }

  getReport() {
    this.employeeService.getReport().subscribe(data => { this.data = data; console.log(data);}, error => { });
  }
  export() {
    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'export-save.xlsx');
  }
}
