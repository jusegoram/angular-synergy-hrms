import { SessionService, AdminService } from '@synergy-app/core/services';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EditUserDialogComponent } from './containers/edit-user-dialog/edit-user-dialog.component';

@Component({
  selector: 'app-account',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss'],
})
export class AccountPageComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  dataSource;

  displayedColumns = ['employee.employeeId', 'firstName', 'employee.status', 'role', 'details'];
  constructor(
    private sessionService: SessionService,
    private adminService: AdminService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}
  ngOnInit() {
    this.getUsers();
  }

  getRoleName(param) {
    const roles = this.adminService.userTypes;
    const role = roles.filter((item) => item.value === parseInt(param, 10));
    return role[0].viewValue;
  }
  reload() {
    this.adminService.clearUsers();
    this.getUsers();
  }

  getUsers() {
    this.adminService.getUsers().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  applyFilter(arg) {}
  deleteUser(event) {
    this.adminService.deleteUser(event._id).subscribe(
      (data) => {
        this.reload();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  openEditDialog(user) {
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      width: '500px',
      data: user,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.adminService.editUser(result).subscribe((resp) => {
        this.reload();
        this.snackBar.open('User was edited successfully', 'thank you', {
          duration: 2000,
        });
      });
    });
  }
}
