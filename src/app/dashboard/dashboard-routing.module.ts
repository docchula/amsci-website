import { NotAllowedGuard } from '../not-allowed.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { EmailCheckComponent } from 'app/dashboard/email-check/email-check.component';
import { DashboardComponent } from 'app/dashboard/dashboard/dashboard.component';
import { InformationComponent } from 'app/dashboard/information/information.component';
import { EmailVerifyGuard } from 'app/dashboard/email-verify.guard';
import { AcceptRulesComponent } from 'app/dashboard/accept-rules/accept-rules.component';
import { AuthGuard } from 'app/auth.guard';
import { SchoolDetailComponent } from 'app/dashboard/school-detail/school-detail.component';
import { AcceptGuard } from 'app/dashboard/accept.guard';
import { SchoolDetailGuard } from 'app/dashboard/school-detail.guard';
import { TeamDetailComponent } from 'app/dashboard/team-detail/team-detail.component';
import { TeamFormComponent } from 'app/dashboard/team-form/team-form.component';
import { TeamGuard } from 'app/dashboard/team.guard';
import { SlipUploadComponent } from 'app/dashboard/slip-upload/slip-upload.component';
import { StatusComponent } from 'app/dashboard/status/status.component';
import { MedtalkComponent } from './medtalk/medtalk.component';
import { MedtalkGuard } from './medtalk.guard';
import { CannotAddTeamGuard } from './cannot-add-team.guard';
import { RegistrationGuard } from './registration.guard';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard, RegistrationGuard],
    children: [
      {
        path: '',
        redirectTo: 'info',
        pathMatch: 'full'
      },
      {
        path: 'info',
        component: InformationComponent
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
        path: 'step3',
        canActivate: [EmailVerifyGuard, AcceptGuard],
        component: SchoolDetailComponent
      },
      {
        path: 'step4',
        canActivate: [EmailVerifyGuard, AcceptGuard, SchoolDetailGuard],
        children: [
          {
            path: '',
            component: TeamDetailComponent
          },
          {
            path: 'new',
            component: TeamFormComponent,
            canActivate: [CannotAddTeamGuard]
          },
          {
            path: 'edit/:id',
            component: TeamFormComponent,
            canActivate: []
          }
        ]
      },
      {
        path: 'medtalk',
        canActivate: [EmailVerifyGuard, AcceptGuard, SchoolDetailGuard, TeamGuard],
        component: MedtalkComponent
      },
      {
        path: 'step5',
        canActivate: [EmailVerifyGuard, AcceptGuard, SchoolDetailGuard, TeamGuard, MedtalkGuard],
        component: SlipUploadComponent
      },
      {
        path: 'status',
        component: StatusComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
