import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'adq-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  teamCount: Observable<number>;
  paidTeamCount: Observable<number>;
  doneTeamCount: Observable<number>;
  schoolCount: Observable<number>;

  constructor(private admin: AdminService) { }

  ngOnInit() {
    this.teamCount = this.admin.data.map((users: any[]) => {
      return users.map((user) => {
        if (user.teams) {
          return Object.keys(user.teams).length;
        } else {
          return 0;
        }
      }).reduce((prev, current, index, array) => prev + current, 0);
    });
    this.paidTeamCount = this.admin.data.map((users: any[]) => {
      return users.map((user) => {
        if (user.teams) {
          return Object.keys(user.teams).map((k) => user.teams[k])
          .filter((team) => team.slipUrl && team.slipUrl !== '').length;
        } else {
          return 0;
        }
      }).reduce((prev, current, index, array) => prev + current, 0);
    });
    this.doneTeamCount = this.admin.data.map((users: any[]) => {
      return users.map((user) => {
        if (user.teams) {
          return Object.keys(user.teams).map((k) => user.teams[k])
          .filter((team) => team.slipUrl && team.slipUrl !== '' && team.done).length;
        } else {
          return 0;
        }
      }).reduce((prev, current, index, array) => prev + current, 0);
    });
    this.schoolCount = this.admin.data.map((users: any[]) => {
      return users.filter((user) => (user as Object).hasOwnProperty('teams')).length;
    });
  }

}
