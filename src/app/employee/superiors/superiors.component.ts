import { Component, OnInit } from '@angular/core';
import {SuperiorsService} from './superiors.service';
import {EmployeeService} from '../employee.service';

@Component({
  selector: 'app-superiors',
  templateUrl: './superiors.component.html',
  styleUrls: ['./superiors.component.css']
})
export class SuperiorsComponent implements OnInit {

  constructor(private _service: SuperiorsService, private _employee: EmployeeService) {

  }

  ngOnInit(): void {
  }

}
