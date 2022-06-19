import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {AngularFireDatabase} from '@angular/fire/compat/database';
import {SchoolDetail} from 'app/dashboard/school-detail';
import {Team} from 'app/dashboard/team';
import {Observable, combineLatest } from 'rxjs';
import {first, map, mergeMap} from 'rxjs/operators';
import {People} from './people';

@Injectable()
export class UserStatusService {
  isEmailVerified: Observable<boolean>;
  isAcceptedRules: Observable<boolean>;
  schoolDetail: Observable<SchoolDetail>;
  isSchoolDetailDone: Observable<boolean>;
  teams: Observable<Team[]>;
  hasTeams: Observable<boolean>;
  hasIndividuals: Observable<boolean>;
  slipUploaded: Observable<boolean>;
  medTalk: Observable<boolean>;
  individuals: Observable<People[]>;

  constructor(private afa: AngularFireAuth, private afd: AngularFireDatabase) {
    this.isEmailVerified = this.afa.authState.pipe(
      map(user => user.emailVerified)
    );
    this.isAcceptedRules = this.afa.authState.pipe(
      first(),
      mergeMap(user => this.afd.object(`/data/${user.uid}/accepted`).valueChanges()),
      map(accepted => {
        return !!accepted;
      })
    );
    this.schoolDetail = this.afa.authState.pipe(
      first(),
      mergeMap(user => this.afd.object<SchoolDetail>(`/data/${user.uid}/schoolDetail`).valueChanges()),
      map(v => {
        if (v) {
          return v;
        } else {
          return null;
        }
      })
    );
    this.isSchoolDetailDone = this.schoolDetail.pipe(
      map(_schoolDetail => {
        if (_schoolDetail) {
          return true;
        } else {
          return false;
        }
      })
    );
    this.teams = this.afa.authState.pipe(
      first(),
      mergeMap(user => this.afd.list<Team>(`/data/${user.uid}/teams`).snapshotChanges()),
      map(v => {
        return v.map(t => {
          return {
            $key: t.key,
            ...t.payload.val()
          };
        });
      }),
      map(v => {
        if (v) {
          return v;
        } else {
          return null;
        }
      })
    );
    this.individuals = this.afa.authState.pipe(
      first(),
      mergeMap(user => this.afd.list<People>(`/data/${user.uid}/individuals`).snapshotChanges()),
      map(v => {
        return v.map(t => {
          return {
            $key: t.key,
            ...t.payload.val()
          };
        });
      }),
      map(v => {
        if (v) {
          return v;
        } else {
          return null;
        }
      })
    );
    this.hasTeams = this.teams.pipe(
      map(_teams => {
        if (_teams.length > 0) {
          return true;
        } else {
          return false;
        }
      })
    );
    this.hasIndividuals = this.individuals.pipe(
      map(people => {
        if (people.length > 0) {
          return true;
        } else {
          return false;
        }
      })
    );
    this.medTalk = this.teams.pipe(
      map(_teams => {
        if (_teams.length === 0) {
          return false;
        } else {
          return _teams.map(team => {
            return team.student1.medTalkConfirmed && team.student2.medTalkConfirmed;
          })
            .reduce((prev, value, index, array) => {
              return prev && value;
            }, true);
        }
      })
    );
    this.slipUploaded = combineLatest([this.teams.pipe(
      map(_teams => {
        if (_teams.length === 0) {
          return true;
        } else {
          return _teams
            .map(team => {
              if (team.slipGUID && team.slipGUID !== '') {
                return true;
              } else {
                return false;
              }
            })
            .reduce((prev, value, index, array) => {
              return prev && value;
            }, true);
        }
      })
    ), this.individuals.pipe(
      map(people => {
        if (people.length === 0) {
          return true;
        } else {
          return people
            .map(person => {
              if (person.slipGUID && person.slipGUID !== '') {
                return true;
              } else {
                return false;
              }
            })
            .reduce((prev, value, index, array) => {
              return prev && value;
            }, true);
        }
      })
    )]).pipe(
      map(results => {
          return results[0] && results[1];
        }
      )
    );
  }
}
