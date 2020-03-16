import { Component, OnInit, ViewChild } from '@angular/core';
import { OperationsService } from '../operations.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeHours } from '../../employee/Employee';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as XLSX from 'xlsx';
import moment from 'moment';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent   {
  displayedColumns2 = ['employeeId'];
  constructor() { }
}
