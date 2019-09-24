import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MainComponent} from './components/main/main.component';
import {PayslipsComponent} from './components/payslips/payslips.component';
import {UploadComponent} from './components/upload/upload.component';
import {ExportComponent} from './components/export/export.component';

export const routes: Routes = [
  {
    path: '',
    children : [
      { path: 'manage', component: MainComponent },
      { path: 'payslip', component: PayslipsComponent },
      { path: 'upload', component: UploadComponent },
      { path: 'export', component: ExportComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayrollRoutingModule { }
