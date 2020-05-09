import { MatTableDataSource } from '@angular/material/table';
import { Component, Input, OnInit } from '@angular/core';
import { EmployeeService } from '@synergy-app/core/services';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-available-information',
  templateUrl: './available-information.component.html',
  styleUrls: ['./available-information.component.scss'],
})
export class AvailableInformationComponent implements OnInit {
  @Input() query: any;
  @Input() focused: boolean;
  isLoaded = false;
  dataSource: any;
  displayedColumns = ['index', 'employeeId', 'name', 'client', 'campaign', 'action'];
  wb: XLSX.WorkBook;
  constructor(private _employeeService: EmployeeService) {}
  onLoad() {
    // if (!this.isLoaded) {
    //   this._employeeService.availableInformation(this.query).subscribe(
    //     (result) => {
    //       this.populateTable(result);
    //       this.isLoaded = true;
    //     },
    //     (error) => {
    //       console.error(error);
    //     }
    //   );
    //   this.wb = XLSX.utils.book_new();
    // }
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

  onExport() {
    this.constructTableObj(this.dataSource.data).then(
      (resolved: any[]) => {
        const main: XLSX.WorkSheet = XLSX.utils.json_to_sheet(resolved);
        XLSX.utils.book_append_sheet(this.wb, main, 'exported-info');
        XLSX.writeFile(this.wb, 'export-info.xlsx');
      }
      );
  }

  onClear() {
    this.dataSource = null;
    this.isLoaded = false;
  }

  constructTableObj(arr: any[]) {
    return new Promise((resolve) => {
      const mapped = arr.map((item) => {
        let complementaryObject;
        switch (this.query.reportType) {
          case 'avatar':
            complementaryObject.avatar = false;
            break;
          case 'company':
            if (item.company !== null && item.company !== undefined) {
              delete item.company._id;
              delete item.company.employee;
              delete item.company.employeeId;
              complementaryObject = item.company;
              break;
            } else {
              break;
            }
          case 'shift':
            if (item.shift !== null && item.shift !== undefined) {
              complementaryObject['Amount Of Shifts'] = item.shift && item.shift.length;
              break;
            } else {
              break;
            }
          case 'position':
            if (item.position !== null && item.position !== undefined) {
              complementaryObject['Amount Of Positions'] = item.position && item.position.length;
              break;
            } else {
              break;
            }
          case 'payroll':
            if (item.payroll !== null && item.payroll !== undefined) {
              delete item.payroll._id;
              delete item.payroll.employee;
              delete item.payroll.employeeId;
              complementaryObject = item.payroll;
              break;
            } else {
              break;
            }
          case 'personal':
            if (item.personal !== null && item.personal !== undefined) {
              delete item.personal._id;
              delete item.personal.employee;
              delete item.personal.employeeId;
              item.personal.hobbies =
                item.personal.hobbies !== null && item.personal.hobbies !== undefined
                  ? item.personal.hobbies.length
                  : 'MISSING HOBBIES';
              complementaryObject = item.personal;
              break;
            } else {
              break;
            }
          case 'family':
            if (item.family !== null && item.family !== undefined) {
              complementaryObject['Amount of Contacts'] = item.family && item.family.length;
              break;
            } else {
              break;
            }

          default:
            break;
        }
        return {
          employeeId: item.employeeId,
          firstName: item.firstName,
          middleName: item.middleName,
          lastName: item.lastName,
          socialSecurity: item.socialSecurity,
          gender: item.gender,
          status: item.status,
          ...complementaryObject,
        };
      });
      resolve(mapped);
    });
  }
}
