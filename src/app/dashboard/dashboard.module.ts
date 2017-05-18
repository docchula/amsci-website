import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { EmailCheckComponent } from './email-check/email-check.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InformationComponent } from './information/information.component';
import { SharedModule } from 'app/shared/shared.module';
import { EmailVerifyGuard } from './email-verify.guard';
import { AcceptRulesComponent } from './accept-rules/accept-rules.component';
import { UserStatusService } from './user-status.service';
import { SchoolDetailComponent } from './school-detail/school-detail.component';
import { AcceptGuard } from './accept.guard';
import { ReactiveFormsModule } from '@angular/forms';
import { TeamDetailComponent } from './team-detail/team-detail.component';
import { SchoolDetailGuard } from './school-detail.guard';
import { FullnamePipe } from './fullname.pipe';
import { TeamFormComponent } from './team-form/team-form.component';
import { PictureOrPlaceholderPipe } from './picture-or-placeholder.pipe';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [
    EmailCheckComponent,
    DashboardComponent,
    InformationComponent,
    AcceptRulesComponent,
    SchoolDetailComponent,
    TeamDetailComponent,
    FullnamePipe,
    TeamFormComponent,
    PictureOrPlaceholderPipe
  ],
  providers: [EmailVerifyGuard, UserStatusService, AcceptGuard, SchoolDetailGuard]
})
export class DashboardModule { }
