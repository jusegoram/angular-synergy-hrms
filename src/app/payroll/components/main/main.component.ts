import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  dataSource: any;
  testEmployee = [{
    employeeId: 123456,
    employeeName: 'test test test',
    client: 'RCC',
    campaign: 'Icon',
    netPayment: 2000,
    deductions: 10,
    bonuses: 10,
    totalPayment: 10,
    date: new Date(),
  }];

  displayedColumns = ['employeeId'];
  constructor() { }

  ngOnInit() {
    this.populateTable(this.testEmployee);
  }


  populateTable(data) {
    console.log(data);
    this.dataSource = new MatTableDataSource(data);
  }
}
