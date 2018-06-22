import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  data: any;
  clients: any[];
  campaigns: any[];
  status: any[];
  dataSource: any;
  reportForm: FormGroup;
  queryForm: FormGroup;
  displayedColumns = [];
  constructor(private employeeService: EmployeeService, private fb: FormBuilder) {
    this.clients = [];
    this.campaigns = [];
    this.status = this.employeeService.items;
  }
  ngOnInit() {
    this.employeeService.getClient().subscribe(data => this.clients = data);
    this.buildForm();
  }
  buildForm() {
    this.reportForm = this.fb.group({
      statusCheck: [false],
      clientCheck: [false],
      campaignCheck: [false],
      supervisorCheck: [false],
      hireDateCheck: [false],
      terminationDateCheck: [false],
      managerCheck: [false],
      trainingGroupCheck: [false]
    });

    this.queryForm = this.fb.group({
      status: [''],
      client: [''],
      campaign: [''],
      supervisor: [''],
      hireDateFrom: [''],
      hireDateTo: [new Date()],
      terminationDateFrom: [''],
      terminationDateTo: [new Date()],
      manager: [''],
      trainingGroup: [''],
      trainingNo: ['']
    });
  }
  getReport() {
    const queryParam = this.queryForm.value;
    const obj = {
   //   status: queryParam.status,
      client: queryParam.client.name,
      campaign: queryParam.campaign.name,
      supervisor: queryParam.supervisor,
      manager: queryParam.manager,
      hireDate: { $gte: queryParam.hireDateFrom, $lt: queryParam.hireDateTo},
      terminationDate: {$gte: queryParam.terminationDateFrom, $lt: queryParam.terminationDateTo},
      trainingGroupRef: queryParam.trainingGroup,
      trainingGroupNum: queryParam.trainingNo
    }
    this.employeeService.getReport(obj).subscribe(
        data => {
          this.buildTable(data);   // console.log(Object.getOwnPropertyNames(data[data.length - 1]));
        }, error => { });
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
  setCampaigns(event: any) {
    this.campaigns = event.campaigns;
  }

  buildTable(event: any){
    this.displayedColumns = Object.getOwnPropertyNames(event[event.length - 1]);
    this.dataSource = new MatTableDataSource(event);
    this.data = event;
  }

  clear(){
    this.dataSource = null;
    this.data = null;
    this.buildForm();
  }
}
