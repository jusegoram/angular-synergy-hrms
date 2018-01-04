import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'position-info',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.css']
})
export class PositionComponent implements OnInit {
  dataSource: any;
  displayedColumns = ['position', 'startDate', 'endDate'];
  constructor() { }

  ngOnInit() {
  }

}
