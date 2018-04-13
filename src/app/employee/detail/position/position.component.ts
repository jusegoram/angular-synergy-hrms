import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';
import { EmployeePosition } from '../../services/models/employee-models';
import { EmployeeService } from '../../services/employee.service';
import { MatTableDataSource } from '@angular/material';



@Component({
  selector: 'position-info',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.css']
})
export class PositionComponent implements OnChanges {
  @Input() employeeId: string;
  @Input() authorization: boolean;
positions = [
  { id: '1001', name: 'ED 1' },
  { id: '1002', name: 'Rep 2: A' },
  { id: '1003', name: 'Rep 3: Silver' },
  { id: '1004', name: 'Rep 4: Gold' },
  { id: '1005', name: 'Rep 5: Platinum' },
  { id: '1006', name: 'Rep 6: Emerald' },
  { id: '1007', name: 'Rep 7: ' },
  { id: '1008', name: 'Rep 8' },
  { id: '1009', name: 'Cleaner I' },
  { id: '1010', name: 'Security' },
  { id: '1011', name: 'Trainee' },
  { id: '1002', name: 'ED 1 - old' },
  { id: '1002', name: 'Rep 2: A - old' },
  { id: '1003', name: 'Rep 3: Silver - old' },
  { id: '1004', name: 'Rep 4: Gold - old' },
  { id: '1005', name: 'Rep 5: Platinum - old' },
  { id: '1006', name: 'Rep 6: Emerald - old' },
  { id: '1007', name: 'Rep 7:  - old' },
  { id: '1008', name: 'Rep 8 - old' },
  { id: '1122', name: 'Cleaner I - old' },
  { id: '1010', name: 'Security - old' },
  { id: '1011', name: 'Trainee - old' }];

  selected: any;
  dataSource: any;
  displayedColumns = ['positionid', 'position', 'startDate', 'endDate'];
  constructor(private employeeService: EmployeeService) { }


  ngOnChanges(changes: SimpleChanges): void {
    if (this.employeeId != null && changes['employeeId']) {
      this.employeeService.getPositions(this.employeeId).subscribe(
        (employeePosition: EmployeePosition[] ) => {
          this.dataSource = new MatTableDataSource(employeePosition);
      });
    }
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}
