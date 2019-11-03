import { MinuteSecondsPipe } from './../../../shared/pipes/minute-seconds.pipe';
import { MatTableDataSource } from '@angular/material';
import { ChartData, Datum } from './../../../shared/ChartData';
import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  resolvedData: any;
  stats: any[];
  payroll: any;
  doughnutChartData: ChartData;
  barChartData: ChartData;
  width = '100%';
  height = '100%';
  widthBar = '100%';
  heightBar = '100%';
  type = 'doughnut2d';
  dataFormat = 'json';
  barChartSwitchableData: any[];
  totals: any;
  totalTableDataSource: any;
  clientTableDataSource: any;
  dataSource:any;
  filterItems: any;
  filterValue = '';
  constructor(private route: ActivatedRoute, private zone: NgZone, private minutesecondsPipe: MinuteSecondsPipe) { }

  ngOnInit() {
    this.resolvedData = this.route.snapshot.data['payroll'];
    this.stats = this.resolvedData.stats;
    this.payroll = this.resolvedData.payroll[0];
    this.dataSource = new MatTableDataSource(this.payroll.employees);
    this.filterItems = ['employeeId','employeeName', 'client', 'campaign'];
    this.barChartSwitchableData = this.mapBarChartData(this.stats);
    this.totals = this.calculateTotals(this.stats);
    this.totalTableDataSource = new MatTableDataSource(this.totals);
    this.initializeCharts();

  }
    applyFilter(filter: string) {
      if(filter){
        filter = filter.trim(); // Remove whitespace
        filter = filter.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filter;
      }
    }

  dataplotClickHandler(eventObj) {
    const dataObj = eventObj.dataObj;
    this.zone.run(() => {
      this.barChartData.chart.caption = `${dataObj.categoryLabel}'s Financial Details`;
      this.barChartData.data = this.barDataSwitch(dataObj.categoryLabel);
      this.setClientTableData(dataObj.categoryLabel);
    });
  }

  initializeCharts() {
    this.doughnutChartData = new ChartData({
      caption: 'Payroll Campaign Distribution Chart',
      subCaption: 'For employees in the current payroll',
      defaultcenterlabel: 'RCC BPO',
      aligncaptionwithcanvas: '0',
      captionpadding: '0',
      decimals: '1',
      plottooltext:
        '<b>$percentValue</b> of our employees are on <b>$label</b>',
      centerlabel: 'Employees: $value',
      theme: 'fusion',
      exportenabled: '1',
      exportfilename: 'payrollDoughnutChart1'
    }, this.mapDoughNutChartData(this.stats, 'client', '', 'employeesAmount'));

    this.barChartData = new ChartData(
      {
        caption: "AIP's Financial Details",
        decimals: '2',
        numberPrefix: '$',
        subcaption: '',
        xaxisname: 'Concept',
        yaxisname: 'Amount (BZD)',
        plottooltext:
          ' <b>$label</b> - $<b>$value</b>',
        numbersuffix: '',
        theme: 'fusion',
        exportenabled: '1',
        exportfilename: 'payrollBarChart1'
      }
      , this.barDataSwitch('AIP'));
      this.setClientTableData('AIP');

  }
  barDataSwitch(client) {
    let data = this.barChartSwitchableData.filter(item => item.client === client);
    return data[0].data;
  }
  mapBarChartData(data: any[]) {
    const mirrorData = JSON.parse(JSON.stringify(data));
    let mappedItems = [];
    mappedItems = mirrorData.map(item => {
      let keyArray = {
        client: item._id.client,
        data: [],
      };
      delete item.totalRegularHours;
      delete item.totalOvertimeHours;
      delete item.totalHolidayHoursX2;
      delete item.totalHolidayHoursX1;
      delete item.totalWeeklyWages;
      delete item.employeesAmount;
      delete item.campaigns;
      delete item._id;
      Object.keys(mirrorData[0]).forEach((key, index) => {
        const result = key.replace(/([A-Z])/g, ' $1');
        const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
        keyArray.data.push({
          label: finalResult,
          value: Math.round(item[key] * 100) / 100,
        });
      });
      return keyArray;
    });

    return mappedItems;
  }

  setClientTableData(client){
    const data = JSON.parse(JSON.stringify(this.stats.filter(item => item._id.client === client)[0]))
    delete data._id;
    const mappedData = Object.keys(data).map( (key, index) => {
      const result = key.replace(/([A-Z])/g, ' $1');
      const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
      if (key === 'campaigns') {
        return {
          label: finalResult,
          value: data[key].length
        }
      } else {
        const transform = this.minutesecondsPipe.transform(Math.round( data[key] * 100)/100)
        const value = index === 5 || index === 7 || index === 9 || index === 11
        ? transform : (Math.round( data[key] * 100)/100).toLocaleString('en-US', {minimumFractionDigits: 2});
        return {
          label: finalResult,
          value:  value
        }
      }
    });
    this.clientTableDataSource = new MatTableDataSource(mappedData);
  }
  calculateTotals(data: any[]) {
    const calculatedTotal = {
      campaigns: 0,
      employeesAmount: 0,
      totalPayed: 0,
      totalWeeklyWages: 0,
      totalTaxes: 0,
      totalRegularHours: 0,
      totalRegularHoursPay: 0,
      totalOvertimeHours: 0,
      totalOvertimeHoursPay: 0,
      totalHolidayHoursX2: 0,
      totalHolidayHoursX2Pay: 0,
      totalHolidayHoursX1: 0,
      totalHolidayHoursX1Pay: 0,
      totalBonus: 0,
      totalOtherpay: 0,
      totalCompanyContributions: 0,
      totalEmployeeContributions: 0,
    };

    const returnedArr = Object.keys(calculatedTotal).map( (key, index) => {
      const result = key.replace(/([A-Z])/g, ' $1');
      const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
      if (key === 'campaigns') {
        return {
          label: finalResult,
          value:  data.reduce((a, b) => {return {[key]: a[key].concat(b[key])}})[key].length
        }
      } else {
        let value
        if(index === 5 || index === 7 || index ===  9 || index === 11) {
          const calc = Math.round( data.reduce((a, b) => {return { [key]: a[key] + b[key] }})[key] * 100)/100
          value = this.minutesecondsPipe.transform(calc)
        } else {
          value = Math.round( data.reduce((a, b) => {return { [key]: a[key] + b[key] }})[key] * 100)/100
          value = parseInt( value, 10).toLocaleString('en-US', {minimumFractionDigits: 2})
          }
        return {
          label: finalResult,
          value:  value
        }
      }
    });

    return returnedArr;
  }
  mapDoughNutChartData(data, labelPath, labelPath2, valuePath): Datum[] {
    let mappedData: Datum[];
    mappedData = data.map((item) => {
      let label;
      if (labelPath === 'client' && labelPath2 === '') {
        label = item._id.client;
      } else {
        label = item[labelPath] + ' - ' + item[labelPath2];
      }
      return {
        label: label,
        value: item[valuePath]
      };
    });
    return mappedData;
  }

}
