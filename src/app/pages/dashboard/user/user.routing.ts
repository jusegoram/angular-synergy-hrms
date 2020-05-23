import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'profile',
        loadChildren: () => import('./profile-page/profile-page.module').then((m) => m.ProfilePageModule),
      },
      {
        path: 'settings',
        loadChildren: () => import('./settings-page/settings-page.module').then((m) => m.SettingsPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
