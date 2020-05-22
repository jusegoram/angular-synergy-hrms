import { Component, OnInit } from '@angular/core';
import { OperationsService } from '@synergy-app/core/services/operations.service';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as XLSX from 'xlsx';

@Component({
  selector: 'report-kpi',
  templateUrl: './kpi.component.html',
  styleUrls: ['./kpi.component.scss'],
})
export class KpiComponent implements OnInit {
  items;
  kpiGroups = [
    {
      name: 'TIB',
      kpi: [
        {name: 'Quality'},
        {name: 'PrimaryClosing'},
        {name: 'SPC'},
        {name: 'SPH'},
        {name: 'GrossClosing'},
        {name: 'Adherence'},
      ],
    },
    {
      name: 'CIT',
      kpi: [
        {name: 'OCR'},
        {name: 'UCR'},
        {name: 'HomeSecurity'},
        {name: 'Quality'},
        {name: 'NRPC'},
        {name: 'GRPO'},
        {name: 'Satellite'},
        {name: 'DukeRSP'},
        {name: 'AmericanWater'},
        {name: 'GeekSquad'},
        {name: 'Quality'},
      ],
    },
    {
      name: 'CCS',
      kpi: [{ name: 'Efficiency' }, { name: 'Adherence' }],
    },
    {
      name: 'RAD',
      kpi: [{ name: 'AIMS' }, { name: 'UPH' }, { name: 'Adherence' }, { name: 'CSAT' }],
    },
    {
      name: 'FALC',
      kpi: [{ name: 'Avg Claim Time' }, { name: 'Adherence' }],
    },
    {
      name: 'ATLAS',
      kpi: [{ name: 'Avg Claim Time' }, { name: 'Adherence' }],
    },
    {
      name: 'AIP',
      kpi: [
        { name: 'Conversion' },
        { name: 'Calls Answered' },
        { name: 'LostJobs' },
        { name: 'Escalations' },
        { name: 'Immediate Coaching' },
      ],
    },
  ];
  kpis: any[];
  clients = [];
  campaigns = [];
  dataSource: any;
  dialData: object;
  queryForm: FormGroup;
  displayedColumns = ['employeeId', 'fullName', 'client', 'campaign', 'teamId', 'kpiName', 'score', 'date', 'action'];
  notfound;

  constructor(private operationsService: OperationsService, private fb: FormBuilder) {}

  ngOnInit() {
    this.operationsService.getClient().subscribe((data) => {
      this.clients = data;
    });
    this.buildQueryForm();
  }

  buildQueryForm() {
    this.queryForm = this.fb.group({
      kpiFrom: [''],
      kpiTo: [new Date()],
      kpiClient: [''],
      kpiCampaign: [''],
      kpiTeamId: [''],
      kpiName: [''],
    });
  }

  populateTable(query) {
    this.operationsService.getKpis(query).subscribe(
      (res) => {
        res.map((item) => {
          item.date = new Date(item.date);
        });
        this.kpis = res;
        this.notfound = this.kpis.length === 0 ? true : false;
        this.dataSource = new MatTableDataSource(this.kpis);
      },
      (error) => console.log(error),
      () => {}
    );
  }

  setCampaigns(event: any) {
    this.campaigns = event.campaigns;
  }

  runQuery() {
    const queryParam = this.queryForm.value;
    const query = {
      client: queryParam.client,
      campaign: queryParam.kpiCampaign,
      date: { $gte: queryParam.kpiFrom, $lte: queryParam.kpiTo },
      kpiName: queryParam.kpiName,
      teamId: queryParam.kpiTeamId,
    };
    this.populateTable(query);
  }

  export() {
    const exportData = JSON.parse(JSON.stringify(this.dataSource.data));

    const mappedData = exportData.map((item) => {
      item.score = item.score ? item.score : item.scoreInTime.value;
      return item;
    });
    const main: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mappedData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, main, 'kpi-info');
    XLSX.writeFile(wb, 'export-kpi.xlsx');
  }

  clear() {
    this.notfound = false;
    this.queryForm.reset();
    this.dataSource = null;
  }
}
