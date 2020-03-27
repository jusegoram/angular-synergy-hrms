import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { PayrollService } from "../../../services/payroll.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { MatTableDataSource } from "@angular/material/table";
import { SelectionModel } from "@angular/cdk/collections";

@Component({
  selector: "app-non-finalized-payrolls",
  templateUrl: "./non-finalized-payrolls.component.html",
  styleUrls: ["./non-finalized-payrolls.component.scss"],
})
export class NonFinalizedPayrollsComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  dataSource: any;
  displayedColumns = [
    "selected",
    "isPayed",
    "fromDate",
    "toDate",
    "employeesAmount",
    "totalPayed",
    "totalCompanyContributions",
    "totalEmployeeContributions",
    "totalTaxes",
    "details",
  ];
  filterValue = "";
  type = [
    { type: "", view: "All" },
    { type: "BI-WEEKLY", view: "Bi-Weekly Payroll" },
    { type: "SEMIMONTHLY", view: "Semi-Monthly Payroll" },
  ];
  refreshEvent: any;
  selectedType = "";
  auth: any;
  checkedRows: any;
  user;
  constructor(
    private _payrollService: PayrollService,
    public snackBar: MatSnackBar,
    private _bottomSheet: MatBottomSheet
  ) {
    this.user = this._payrollService.getDecodedToken();
  }

  ngOnInit() {
    this.auth = this._payrollService.getAuth();
    this.getData("all");
  }

  onPaySelectedPayrolls() {
    if (this.checkedRows.selected.length === 2) {
      const item = this.checkedRows.selected;
      const ids = [item[0]._id, item[1]._id];
      const query = this.user;
      this._payrollService
        .updatePayroll(JSON.stringify(ids), query, "PAY")
        .subscribe((result) => {
          this.getData("all");
        });
    } else {
      this.openSnackBar(
        `It's only allowed to pay 2 Payrolls at a time`,
        "Got it, Thanks!"
      );
    }
  }

  populateTable(data) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.checkedRows = new SelectionModel(true, []);
  }

  applyFilter(filter: string) {
    if (filter) {
      filter = filter.trim(); // Remove whitespace
      filter = filter.toLowerCase(); // MatTableDataSource defaults to lowercase matches
      this.dataSource.filter = filter;
    }
  }

  getData(id) {
    this._payrollService.getPayroll(id, this.selectedType, false).subscribe(
      (result: any[]) => {
        this.populateTable(result);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  reloadData(e) {
    this.refreshEvent = e;
    this.getData("all");
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
    });
  }
}
