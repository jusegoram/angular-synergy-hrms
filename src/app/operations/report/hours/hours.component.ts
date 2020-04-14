import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OperationsService } from '../../operations.service';
import { MatTableDataSource } from '@angular/material/table';
import moment from 'moment';
import * as XLSX from 'xlsx';

@Component({
  selector: 'report-hours',
  templateUrl: './hours.component.html',
  styleUrls: ['./hours.component.scss'],
})
export class HoursComponent implements OnInit {
  dataSource = null;
  auth: any;
  hours: any[];
  displayedColumns = [
    'employeeID',
    'fullName',
    'dialerID',
    'hours',
    'tosHours',
    'timeIn',
    'date',
    'action',
  ];
  clients = [];
  campaigns = [];
  queryForm: FormGroup;
  notfound;
  displayedColumns2 = ['employeeId'];
  constructor(private _opsService: OperationsService, private fb: FormBuilder) {}
  ngOnInit() {
    this._opsService.getClient().subscribe((data) => {
      this.clients = data;
    });
    this.buildQueryForm();
  }

  populateTable(query) {
    this._opsService.getHours(query).subscribe(
      (res) => {
        res.map((item) => {
          item.date = new Date(item.date);
        });
        this.hours = res;
        this.notfound = this.hours.length === 0 ? true : false;
        this.dataSource = new MatTableDataSource(this.hours);
      },
      (error) => console.log(error),
      () => {}
    );
  }
  buildQueryForm() {
    this.queryForm = this.fb.group({
      From: [''],
      To: [new Date()],
      Client: [''],
      Campaign: [''],
      dialerId: [''],
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
    const exportData = JSON.parse(JSON.stringify(this.dataSource.data));

    const mappedData = exportData.map((item) => {
      delete item._id;
      delete item.__v;
      delete item.employee;
      item.date = moment(item.date).format('MM/DD/YYYY').toString();
      item.systemHours = item.systemHours.value;
      item.tosHours = item.tosHours.value;
      item.timeIn = item.timeIn.value;
      return item;
    });
    const main: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mappedData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, main, 'hours-info');
    XLSX.writeFile(wb, 'export-hours.xlsx');
    console.log(exportData.length === this.dataSource.data.length);
  }
  setCampaigns(event: any) {
    this.queryForm.value.Campaign = '';
    this.campaigns = event.campaigns;
  }
  runQuery() {
    const queryParam = this.queryForm.value;
    const query = {
      client: queryParam.Client && queryParam.Client.name,
      campaign: queryParam.Campaign,
      date: {
        $gte: moment(queryParam.From).startOf('day').toDate(),
        $lte: moment(queryParam.To).endOf('day').toDate(),
      },
      dialerId: queryParam.dialerId,
    };
    this.populateTable(query);
  }
}
