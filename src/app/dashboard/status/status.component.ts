import { Component, OnInit } from '@angular/core';
import { UserStatusService } from '../user-status.service';
import { Observable } from 'rxjs/Observable';
import { Team } from 'app/dashboard/team';
import { SchoolDetail } from 'app/dashboard/school-detail';

@Component({
  selector: 'adq-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {

  teams: Observable<Team[]>;
  detail: Observable<SchoolDetail>;
  hasTeams: Observable<boolean>;

  constructor(private userStatus: UserStatusService) { }

  ngOnInit() {
    this.teams = this.userStatus.teams;
    this.detail = this.userStatus.schoolDetail;
    this.hasTeams = this.userStatus.hasTeams;
  }

}
