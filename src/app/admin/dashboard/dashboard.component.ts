import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AdminService } from '../admin.service';

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
  medTalkCount: Observable<number>;

  constructor(private admin: AdminService) {}

  ngOnInit() {
    this.teamCount = this.admin.data.pipe(
      map((users: any[]) => {
        return users
          .map(user => {
            if (user.teams) {
              return Object.keys(user.teams).length;
            } else {
              return 0;
            }
          })
          .reduce((prev, current, index, array) => prev + current, 0);
      })
    );
    this.paidTeamCount = this.admin.data.pipe(
      map((users: any[]) => {
        return users
          .map(user => {
            if (user.teams) {
              return Object.keys(user.teams)
                .map(k => user.teams[k])
                .filter(team => team.slipUrl && team.slipUrl !== '').length;
            } else {
              return 0;
            }
          })
          .reduce((prev, current, index, array) => prev + current, 0);
      })
    );
    this.doneTeamCount = this.admin.data.pipe(
      map((users: any[]) => {
        return users
          .map(user => {
            if (user.teams) {
              return Object.keys(user.teams)
                .map(k => user.teams[k])
                .filter(
                  team => team.slipUrl && team.slipUrl !== '' && team.done
                ).length;
            } else {
              return 0;
            }
          })
          .reduce((prev, current, index, array) => prev + current, 0);
      })
    );
    this.schoolCount = this.admin.data.pipe(
      map((users: any[]) => {
        return users.filter(user => (user as Object).hasOwnProperty('teams'))
          .length;
      })
    );
    this.medTalkCount = this.admin.data.pipe(
      map((users: any[]) => {
        return users
          .map(user => {
            if (user.teams) {
              return Object.keys(user.teams)
                .map(k => user.teams[k])
                .filter(
                  team => !!team.medTalkCome
                ).length;
            } else {
              return 0;
            }
          })
          .reduce((prev, current, index, array) => prev + current, 0);
      })
    );
  }
}
