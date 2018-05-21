import { Component, OnInit } from '@angular/core';
import { FirebaseApp } from 'angularfire2';
import { SchoolDetail } from 'app/dashboard/school-detail';
import { Team } from 'app/dashboard/team';
import 'firebase/storage';
import { Observable, from as observableFrom, of } from 'rxjs';
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

  constructor(
    private userStatus: UserStatusService,
    private fba: FirebaseApp
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
            observableFrom(this.fba
              .storage()
              .ref(`/cards/${team.cardFile}`)
              .getDownloadURL() as Promise<any>)
          );
        } else {
          this.cardUrls.push(of(''));
        }
      });
    });
  }
}
