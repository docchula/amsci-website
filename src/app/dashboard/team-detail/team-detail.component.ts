import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Team } from 'app/dashboard/team';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { UserStatusService } from '../user-status.service';

@Component({
  selector: 'adq-team-detail',
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.scss']
})
export class TeamDetailComponent implements OnInit {
  teams: Observable<Team[]>;
  step4Done: Observable<boolean>;

  constructor(
    private userStatus: UserStatusService,
    private afa: AngularFireAuth,
    private afd: AngularFireDatabase
  ) {}

  ngOnInit() {
    this.teams = this.userStatus.teams;
    this.step4Done = this.userStatus.hasTeams;
  }

  deleteTeam(key: string) {
    this.afa.authState.pipe(map(user => user.uid), first()).subscribe(uid => {
      this.afd.database.ref(`data/${uid}/teams/${key}`).remove();
    });
  }
}
