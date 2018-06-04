import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MainComponent} from './components/main/main.component';
import {BonusComponent} from './components/bonus/bonus.component';
import {DeductionComponent} from './components/deduction/deduction.component';
import {PayslipsComponent} from './components/payslips/payslips.component';
import {UploadComponent} from './components/upload/upload.component';
import {ExportComponent} from './components/export/export.component';

export const routes: Routes = [
  {
    path: '',
    children : [
      { path: 'manage', component: MainComponent },
      { path: 'bonus', component: BonusComponent },
      { path: 'deduction', component: DeductionComponent },
      { path: 'payslips', component: PayslipsComponent },
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
