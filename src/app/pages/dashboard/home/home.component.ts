import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
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

  constructor() {
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

  ngOnInit() {}

  fetchData() {
    const schema = [
      {
        name: 'Time',
        type: 'date',
        format: '%d-%b-%y',
      },
      {
        name: 'Active Employees',
        type: 'number',
      },
    ];
  }
}
