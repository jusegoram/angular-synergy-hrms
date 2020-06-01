import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountPageComponent } from './account-page.component';

const routes: Routes = [
  {
    path: '',
    component: AccountPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountPageRoutingModule {}
