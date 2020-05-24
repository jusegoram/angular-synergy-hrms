import { Routes } from '@angular/router';

export const SessionRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '404',
        loadChildren: () => import('./not-found-page/not-found-page.module').then((m) => m.NotFoundPageModule)
      },
      {
        path: 'error',
        loadChildren: () => import('./error-page/error-page.module').then((m) => m.ErrorPageModule)
      },
      {
        path: 'forgot',
        loadChildren: () => import('./forgot-page/forgot-page.module').then((m) => m.ForgotPageModule)
      },
      {
        path: 'signin',
        loadChildren: () => import('./signin-page/signin-page.module').then((m) => m.SigninPageModule)
      },
    ],
  },
];
