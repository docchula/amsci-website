import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { EmailCheckComponent } from './email-check/email-check.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InformationComponent } from './information/information.component';
import { EmailVerifyGuard } from './email-verify.guard';
import { AcceptRulesComponent } from './accept-rules/accept-rules.component';
import { UserStatusService } from './user-status.service';
import { SchoolDetailComponent } from './school-detail/school-detail.component';
import { AcceptGuard } from './accept.guard';
import { ReactiveFormsModule } from '@angular/forms';
import { TeamDetailComponent } from './team-detail/team-detail.component';
import { SchoolDetailGuard } from './school-detail.guard';
import { TeamFormComponent } from './team-form/team-form.component';
import { SlipUploadComponent } from './slip-upload/slip-upload.component';
import { TeamGuard } from './team.guard';
import { StatusComponent } from './status/status.component';
import { SharedModule } from 'app/shared/shared.module';
import { NotAllowedGuard } from './not-allowed.guard';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    EmailCheckComponent,
    DashboardComponent,
    InformationComponent,
    AcceptRulesComponent,
    SchoolDetailComponent,
    TeamDetailComponent,
    TeamFormComponent,
    SlipUploadComponent,
    StatusComponent
  ],
  providers: [EmailVerifyGuard, UserStatusService, AcceptGuard, SchoolDetailGuard, TeamGuard, NotAllowedGuard]
})
export class DashboardModule { }
