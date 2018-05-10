import { FirebaseApp } from 'angularfire2';
import { Component, OnInit } from '@angular/core';
import { UserStatusService } from '../user-status.service';
import { Observable } from 'rxjs/Observable';
import { Team } from 'app/dashboard/team';
import { SchoolDetail } from 'app/dashboard/school-detail';
import 'firebase/storage';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';

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

  constructor(private userStatus: UserStatusService, private fba: FirebaseApp) { }

  ngOnInit() {
    this.teams = this.userStatus.teams;
    this.detail = this.userStatus.schoolDetail;
    this.hasTeams = this.userStatus.hasTeams;
    this.cardUrls = [];
    this.teams.first().subscribe((teams) => {
      teams.forEach((team) => {
        if (team.cardFile && team.cardFile !== '') {
          this.cardUrls.push(Observable.fromPromise((this.fba.storage().ref(`/cards/${team.cardFile}`).getDownloadURL()) as Promise<any>));
        } else {
          this.cardUrls.push(Observable.of(''));
        }
      });
    });
  }

}
