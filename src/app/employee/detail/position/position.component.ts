import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'position-info',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.css']
})
export class PositionComponent implements OnInit {
  selected: any;
  dataSource: any;
  displayedColumns = ['position', 'startDate', 'endDate'];
  constructor() { }

  ngOnInit() {
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}
