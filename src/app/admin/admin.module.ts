import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminService } from './admin.service';
import { ViewTeamComponent } from './view-team/view-team.component';
import { SharedModule } from 'app/shared/shared.module';
import { QueryComponent } from './query/query.component';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ],
  declarations: [DashboardComponent, ViewTeamComponent, QueryComponent],
  providers: [AdminService]
})
export class AdminModule { }
