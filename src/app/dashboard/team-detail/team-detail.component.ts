import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Team } from 'app/dashboard/team';
import { Observable } from 'rxjs';
import { first, map, share } from 'rxjs/operators';
import { UserStatusService } from '../user-status.service';

@Component({
  selector: 'adq-team-detail',
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.scss']
})
export class TeamDetailComponent implements OnInit {
  teams: Observable<Team[]>;
  step4Done: Observable<boolean>;
  canAddTeam: Observable<boolean>;
  canEditTeam: Observable<boolean>;

  constructor(
    private userStatus: UserStatusService,
    private afa: AngularFireAuth,
    private afd: AngularFireDatabase
  ) {}

  ngOnInit() {
    this.teams = this.userStatus.teams;
    this.step4Done = this.userStatus.hasTeams;
    this.canAddTeam = this.afd.object<boolean>('config/canAddTeam').valueChanges().pipe(share());
    this.canEditTeam = this.afd.object<boolean>('config/canEditTeam').valueChanges().pipe(share());
  }

  deleteTeam(key: string) {
    this.afa.authState.pipe(map(user => user.uid), first()).subscribe(uid => {
      this.afd.database.ref(`data/${uid}/teams/${key}`).remove();
    });
  }
}
