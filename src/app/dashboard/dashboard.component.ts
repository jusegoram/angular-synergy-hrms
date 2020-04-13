import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {DashboardService} from './dashboard.service';

// import * as FusionCharts from 'fusioncharts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  today: number = Date.now();
  type: string;
  width: string;
  height: string;
  dataSource2: any;
  employeeDistribution: Observable<object[]>;
  employeeCount: Observable<object>;
  dataSource1 = {
    chart: {
      caption: 'RCC BPO Employee Distribution',
      showValues: '1',
      showPercentInTooltip: '0',
      enableMultiSlicing: '1',
      theme: 'fusion',
    },
    data: [
      {
        label: 'CCS',
        value: '192',
      },
      {
        label: 'AIP',
        value: '230',
      },
      {
        label: 'RADIAL',
        value: '50',
      },
      {
        label: 'PPP',
        value: '27',
      },
      {
        label: 'FALCON',
        value: '20',
      },
    ],
  };

  constructor(private _dashboardService: DashboardService) {
    this.type = 'timeseries';
    this.width = '60%';
    this.height = '400';
    // This is the dataSource of the chart
    this.dataSource2 = {
      // Initially data is set as null
      data: null,
      caption: {
        text: 'Active Employee Analysis',
      },
      yAxis: [
        {
          plot: {
            value: 'Active Employees',
            type: 'line',
          },
          title: 'Employees',
        },
      ],
    };
    this.fetchData();
  }

  ngOnInit() {
    // this.employeeDistribution = this._dashboardService.employeeDistribution;
    // this.employeeCount = this._dashboardService.employeeCount;
  }
  fetchData() {
    // First we are creating a DataStore
    // const fusionDataStore = new FusionCharts.DataStore();
    // After that we are creating a DataTable by passing our data and schema as arguments
    // const fusionTable = fusionDataStore.createDataTable(data, schema);
    // Afet that we simply mutated our timeseries datasource by attaching the above
    // DataTable into its data property.
    //  this.dataSource2.data = fusionTable;
  }

  // getEmployeeDist(){
  //   this._dashboardService.getEmployeeDistribution();
  //   this.employeeDistribution.subscribe(doc => {
  //     console.log(doc);
  //   })
  // }
  // getActiveEmployeeCount(){
  //   this._dashboardService.getActiveEmployeeCount();
  //   this.employeeCount.subscribe(doc => {
  //     console.log(doc);
  //   })
  // }
}
