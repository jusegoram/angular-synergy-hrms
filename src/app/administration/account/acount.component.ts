import { SessionService } from '../../session/session.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import {  MatTableDataSource, MatPaginator, MatDialog, MatSort, Sort, MatSnackBar } from '@angular/material';
import { AdminService } from '../admin.service';
import { EditUserDialogComponent } from './edit-user-dialog/edit-user-dialog.component';


@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  @ViewChild(MatPaginator , {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort , {static: true}) sort: MatSort;

  dataSource;


  displayedColumns = ['employee.employeeId', 'firstName', 'employee.status', 'role', 'details'];
  constructor(
    private sessionService: SessionService,
    private adminService: AdminService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}
  ngOnInit() {
    this.adminService.getUsers().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  getRoleName(param) {
    let roles = this.adminService.userTypes;
    let role = roles.filter(item => item.value === parseInt(param, 10));
    return role[0].viewValue;
  }
  reload() {
    this.adminService.clearUsers();
    this.adminService.getUsers().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  applyFilter(arg) {

  }
  deleteUser(event) {
    this.adminService.deleteUser(event._id).subscribe(
      data => {
        this.reload();
      },
      error => {
        console.log(error);
      }
    );
  }
  openEditDialog(user){
    console.log(user);
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      width: '500px',
      data: user,
    });

    dialogRef.afterClosed().subscribe( result => {
      console.log(result);
      this.adminService.editUser(result).subscribe(resp => {
        this.reload();
        this.snackBar.open('User was edited succesfully', 'thank you', {
          duration: 2000
        });
      });
    });
  }

}
