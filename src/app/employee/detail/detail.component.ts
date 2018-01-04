import { SessionService } from './../../session/services/session.service';

import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { ActivatedRoute, Params } from '@angular/router';
import { IEmployee } from '../Employee';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  public currentRole: number;
  public currentEmployee: IEmployee;
  constructor(private employeeService: EmployeeService, private activatedRoute: ActivatedRoute, private sessionService: SessionService) { }
  userId: string;
  ngOnInit() {
    this.isAuthorized();
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.userId = params['id'];
      console.log(this.userId);
    });
    this.employeeService.getDetails(this.userId).subscribe(
      (employee: IEmployee ) => {
        this.currentEmployee = employee;
        console.dir(employee);
    });
  }

  public isAuthorized(): boolean {
    this.sessionService.getRole().subscribe(
      (result: number) => {
        this.currentRole = result;
      }
    );
    console.log(this.currentRole);
    if (this.currentRole === 3 || this.currentRole === 4) {
    return false;
      }else {
        return true;
      }
  }
}
