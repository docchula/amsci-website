import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from 'app/home/home.component';
import { AuthGuard } from 'app/auth.guard';
import { AdminGuard } from 'app/admin.guard';
import { NotAllowedGuard } from './not-allowed.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'login',
        loadChildren: './login/login.module#LoginModule',
        canActivate: []
      },
      {
        path: 'dashboard',
        loadChildren: './dashboard/dashboard.module#DashboardModule',
        canLoad: [AuthGuard]
      },
      {
        path: 'u0kM8RMyBGNKyFky8jbm',
        loadChildren: './admin/admin.module#AdminModule',
        canLoad: [AdminGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [NotAllowedGuard]
})
export class AppRoutingModule { }
