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

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule
  ],
  declarations: [EmailCheckComponent, DashboardComponent, InformationComponent, AcceptRulesComponent],
  providers: [EmailVerifyGuard, UserStatusService]
})
export class DashboardModule { }
