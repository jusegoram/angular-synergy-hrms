import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UploadPageComponent } from '../../employee/upload-page/upload.component';

const routes: Routes = [
  {
    path: '',
    component: UploadPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UploadPageRoutingModule {}
