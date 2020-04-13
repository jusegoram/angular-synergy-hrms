import { ConceptsComponent } from './components/concepts/concepts.component';
import { MainComponent } from './components/main/main.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewPayrollComponent } from './components/new-payroll/new-payroll.component';
import { PayslipsComponent } from './components/payslips/payslips.component';
import { UploadComponent } from './components/upload/upload.component';
import { ExportComponent } from './components/export/export.component';
import { DetailComponent } from './components/detail/detail.component';
import { DetailResolver } from './components/detail/detail.resolver';

export const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'main', component: MainComponent },
      { path: 'concepts', component: ConceptsComponent },
      {
        path: 'detail',
        component: DetailComponent,
        resolve: { payroll: DetailResolver },
      },
      { path: 'new', component: NewPayrollComponent },
      { path: 'payslip', component: PayslipsComponent },
      { path: 'upload', component: UploadComponent },
      { path: 'export', component: ExportComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayrollRoutingModule {}
