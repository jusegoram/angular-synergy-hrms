import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';
import { AuthLayoutComponent } from '@synergy-app/shared/layouts/auth/auth-layout.component';
import { SessionGuard } from './session/guards/session.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [SessionGuard],
    canActivateChild: [SessionGuard],
    canLoad: [SessionGuard],
    loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./session/session.module').then((m) => m.SessionModule),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '404',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
