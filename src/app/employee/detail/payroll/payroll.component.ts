import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'payroll-info',
  templateUrl: './payroll.component.html',
  styleUrls: ['./payroll.component.css']
})
export class PayrollComponent implements OnInit {
  @Input() employeeId: string;
  @Input() authorization: boolean;
  constructor() { }

  ngOnInit() {
  }

}
