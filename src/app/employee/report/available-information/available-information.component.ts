import { MatTableDataSource } from '@angular/material';
import { Component, OnInit, Input } from '@angular/core';
import { EmployeeService } from '../../employee.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-available-information',
  templateUrl: './available-information.component.html',
  styleUrls: ['./available-information.component.scss']
})
export class AvailableInformationComponent implements OnInit {
  @Input() query: any;
  @Input() focused: boolean;
  isLoaded = false;
  dataSource: any;
  displayedColumns = ['index', 'employeeId', 'name', 'client', 'campaign', 'action'];
  wb: XLSX.WorkBook;
  constructor(private _employeeService: EmployeeService) {

  }
  onLoad(){
    if(!this.isLoaded) {
      this._employeeService.availableInformation(this.query).subscribe( result => {
        this.populateTable(result);
        this.isLoaded = true;
      }, error => {
        console.error(error);
      })
    this.wb = XLSX.utils.book_new();
  }
  }


  ngOnInit() {
    // if(this.query){
    //   this._employeeService.availableInformation(this.query).subscribe( result => {
    //     this.populateTable(result);
    //   }, error => {

    //   })
    // }
    // this.wb = XLSX.utils.book_new();
  }

  populateTable(data) {
    this.dataSource = new MatTableDataSource(data);
  }

  onExport(){
    this.constructTableObj(this.dataSource.data).then((resolved: any[]) => {
      const main: XLSX.WorkSheet = XLSX.utils.json_to_sheet(resolved);
      XLSX.utils.book_append_sheet(this.wb, main, 'exported-info');
      XLSX.writeFile(this.wb, 'export-info.xlsx');
    }, rejected => {})
  }

  onClear(){
    this.dataSource = null;
    this.isLoaded = false;
  }
  constructTableObj(arr: any[]) {
    return new Promise((resolve, reject) => {
      let mapped = arr.map( item => {
        let mappeditem = {
          employeeId: Number,
          firstName: String,
          middleName: String,
          lastName: String,
          client: String,
          campaign: String,
        };

        mappeditem.employeeId = item.employeeId;
        mappeditem.firstName = item.firstName;
        mappeditem.middleName = item.middleName;
        mappeditem.lastName = item.lastName;
        mappeditem.client = item.company.client;
        mappeditem.campaign = item.company.campaign;

        return mappeditem;
      });
    resolve(mapped);
    })
    }


}
