import { PayrollComponent } from './payroll/payroll.component';
import { Routes, RouterModule } from '@angular/router';
import { ContentComponent } from './content/content.component';
import { AccountComponent } from './account/acount.component';
import { EmployeeComponent } from './employee/employee.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
export const routes: Routes = [
  {
    path: '',
      children : [
         { path : 'employee', component : EmployeeComponent },
         { path : 'payroll', component : PayrollComponent },
         { path : 'permissions', component : AccountComponent },
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
