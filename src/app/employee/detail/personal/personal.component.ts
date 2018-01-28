import { Component, OnInit, Input } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from '../../../session/services/session.service';
import { EmployeePersonal } from '../../services/models/employee-models';

@Component({
  selector: 'personal-info',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent implements OnInit {
  @Input() employeeId: string;
  @Input() authorization: boolean;
  dataSource: EmployeePersonal;

  constructor(private employeeService: EmployeeService, private activatedRoute: ActivatedRoute, private sessionService: SessionService) { }
 
  public isAuth = false;
  ngOnInit() {
    this.isAuthorized();
  }
  public isAuthorized(): boolean {
    this.sessionService.getRole().subscribe(
      (result: number) => {
        if (result === 1 || result === 4) {
          this.isAuth = true;
          return true;
        }
      });
        this.isAuth = false;
        return false;
  }
  loadInfo(){
    this.employeeService.getPositions(this.employeeId).subscribe(
      (employeePosition: EmployeePersonal ) => {
        this.dataSource = employeePosition;
    });
  }
}
