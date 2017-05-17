import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmailCheckComponent } from 'app/dashboard/email-check/email-check.component';
import { DashboardComponent } from 'app/dashboard/dashboard/dashboard.component';
import { InformationComponent } from 'app/dashboard/information/information.component';
import { EmailVerifyGuard } from 'app/dashboard/email-verify.guard';
import { AcceptRulesComponent } from 'app/dashboard/accept-rules/accept-rules.component';
import { AuthGuard } from 'app/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'info',
        pathMatch: 'full'
      },
      {
        path: 'step1',
        component: EmailCheckComponent
      },
      {
        path: 'step2',
        canActivate: [EmailVerifyGuard],
        component: AcceptRulesComponent
      },
      {
        path: 'info',
        component: InformationComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
