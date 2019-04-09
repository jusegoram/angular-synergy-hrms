import { Component, OnInit, ViewChild } from '@angular/core';
import { OperationsService } from '../operations.service';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { EmployeeHours } from '../../employee/Employee';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  dataSource = null;
  auth: any;
  hours: EmployeeHours[];
  displayedColumns = ['employeeID', 'fullName' ,'dialerID', 'hours', 'tosHours', 'timeIn', 'date', 'action'];
  clients = [];
  campaigns = [];
  queryForm: FormGroup;
  notfound;
  displayedColumns2 = ['employeeId'];
  constructor(private _opsService: OperationsService, private fb: FormBuilder) { }
  ngOnInit() {
    this._opsService.getClient().subscribe(data => {
      this.clients = data;
    })
    this.buildQueryForm();
  }

  populateTable(query) {
    this._opsService.getHours(query)
      .subscribe(res => {
        res.map((item) => {
          item.date = new Date(item.date);
        });
        this.hours = res;
        this.notfound = (this.hours.length === 0 )? true : false;
        this.dataSource = new MatTableDataSource(this.hours);
        },
      error => console.log(error), () => {
      });
  }
  buildQueryForm(){
    this.queryForm = this.fb.group({
      From: [''],
      To: [new Date()],
      Client:[''],
      Campaign:[''],
      dialerId:[''],
    });
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  reload() {
    this.queryForm.reset();
    this.notfound = false;
    this.dataSource = null;
  }
  export() {
    let exportData = JSON.parse(JSON.stringify(this.dataSource.data));

    let mappedData = exportData.map(item => {
      item.systemHours = item.systemHours.value;
      item.tosHours = item.tosHours.value;
      item.timeIn = item.timeIn.value;
      return item;
    })
    const main: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mappedData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, main, 'hours-info');
    XLSX.writeFile(wb, 'export-hours.xlsx');
  }
  setCampaigns(event: any) {
    this.campaigns = event.campaigns;
  }
  runQuery(){
    let queryParam = this.queryForm.value;
    let query = {
      'client': queryParam.client,
      'campaign': queryParam.Campaign,
      'date': {$gte: queryParam.From, $lt: queryParam.To},
      'dialerId': queryParam.dialerId,
      }
    this.populateTable(query);
  }
}
