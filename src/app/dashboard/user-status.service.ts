import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/share';
import { Observable } from 'rxjs/Observable';
import { SchoolDetail } from 'app/dashboard/school-detail';
import { Team } from 'app/dashboard/team';

@Injectable()
export class UserStatusService {

  isEmailVerified: Observable<boolean>;
  isAcceptedRules: Observable<boolean>;
  schoolDetail: Observable<SchoolDetail>;
  isSchoolDetailDone: Observable<boolean>;
  teams: Observable<Team[]>;
  hasTeams: Observable<boolean>;
  slipUploaded: Observable<boolean>;

  constructor(private afa: AngularFireAuth, private afd: AngularFireDatabase) {
    this.isEmailVerified = this.afa.authState.map((user) => user.emailVerified);
    this.isAcceptedRules = this.afa.authState.first().mergeMap((user) => this.afd.object(`/data/${user.uid}/accepted`))
    .map((accepted) => {
      if (accepted) {
        return accepted.$value;
      } else {
        return false;
      }
    });
    this.schoolDetail = this.afa.authState.first().mergeMap((user) => this.afd.object(`/data/${user.uid}/schoolDetail`)).map((v) => {
      if (v) {
        return v;
      } else {
        return null;
      }
    });
    this.isSchoolDetailDone = this.schoolDetail.map((_schoolDetail) => {
      if (_schoolDetail.$exists()) {
        return true;
      } else {
        return false;
      }
    });
    this.teams = this.afa.authState.first().mergeMap((user) => this.afd.list(`/data/${user.uid}/teams`)).map((v) => {
      if (v) {
        return v;
      } else {
        return null;
      }
    });
    this.hasTeams = this.teams.map((_teams) => {
      if (_teams.length > 0) {
        return true;
      } else {
        return false;
      }
    });
    this.slipUploaded = this.teams.map((_teams) => {
      if (_teams.length === 0) {
        return false;
      } else {
        return _teams.map((team) => {
          if (team.slipGUID) {
            return true;
          } else {
            return false;
          }
        }).reduce((prev, value, index, array) => {
          return prev && value;
        }, true);
      }
    });
  }

}
