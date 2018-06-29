import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';
import { SchoolDetail } from 'app/dashboard/school-detail';
import { Team } from 'app/dashboard/team';
import { Observable, of } from 'rxjs';
import { first } from 'rxjs/operators';
import { UserStatusService } from '../user-status.service';

@Component({
  selector: 'adq-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {
  teams: Observable<Team[]>;
  detail: Observable<SchoolDetail>;
  hasTeams: Observable<boolean>;
  cardUrls: Observable<string>[];
  canDownloadCard: Observable<boolean>;

  constructor(
    private userStatus: UserStatusService,
    private afd: AngularFireDatabase,
    private afs: AngularFireStorage
  ) {}

  ngOnInit() {
    this.teams = this.userStatus.teams;
    this.detail = this.userStatus.schoolDetail;
    this.hasTeams = this.userStatus.hasTeams;
    this.cardUrls = [];
    this.teams.pipe(first()).subscribe(teams => {
      teams.forEach(team => {
        if (team.cardFile && team.cardFile !== '') {
          this.cardUrls.push(
            this.afs.ref(`/cards/${team.cardFile}`).getDownloadURL()
          );
        } else {
          this.cardUrls.push(of(''));
        }
      });
    });
    this.canDownloadCard = this.afd
      .object<boolean>('config/canDownloadCard')
      .valueChanges();
  }
}
