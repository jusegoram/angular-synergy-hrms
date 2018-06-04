import { Routes, RouterModule } from '@angular/router';
import { ContentComponent } from './content/content.component';
import { UserPermissionComponent } from './user-permission/user-permission.component';
import { EmployeeComponent } from './employee/employee.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
export const routes: Routes = [
  {
    path: '',
      children : [
         { path : 'employee', component : EmployeeComponent },
         { path : 'permissions', component : UserPermissionComponent },
         { path : 'content', component : ContentComponent }
        ]
  }
];

@NgModule({
imports: [
  RouterModule.forChild(routes)
],
exports: [
  RouterModule
]
})
export class AdminRoutingModule { }
