import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from 'app/admin/dashboard/dashboard.component';
import { AdminGuard } from 'app/admin.guard';
import { ViewTeamComponent } from 'app/admin/view-team/view-team.component';
import { QueryComponent } from 'app/admin/query/query.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'view_team/:uid/:tid',
        component: ViewTeamComponent
      },
      {
        path: 'query/:method',
        component: QueryComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
