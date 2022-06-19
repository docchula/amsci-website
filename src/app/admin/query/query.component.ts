import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import {combineLatest, Observable, of as observableOf} from 'rxjs';
import { first, map, take } from 'rxjs/operators';
import { AdminService } from '../admin.service';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'adq-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.scss']
})
export class QueryComponent implements OnInit {
  method: Observable<string>;
  users: Observable<any[]>;
  students: Observable<any[]>;

  constructor(
    private route: ActivatedRoute,
    private admin: AdminService,
    private afd: AngularFireDatabase,
    private clipboard: ClipboardService
  ) {}

  ngOnInit() {
    this.method = this.route.params.pipe(map(params => params['method']));
    this.method.subscribe(method => {
      switch (method) {
        case 'all':
          this.users = this.admin.data.pipe(
            map((users: any[]) => {
              return users.filter(user =>
                (user as Object).hasOwnProperty('teams')
              );
            })
          );
          break;
        case 'paid':
          this.users = this.admin.data.pipe(
            map((users: any[]) => {
              return users
                .filter(user => (user as Object).hasOwnProperty('teams'))
                .map(user => {
                  user.teams = Object.keys(user.teams)
                    .filter(key => {
                      const url = user.teams[key].slipUrl;
                      return url && url !== '';
                    })
                    .reduce(
                      (prev, current, index, array) =>
                        Object.assign(prev, { [current]: user.teams[current] }),
                      {}
                    );
                  return user;
                })
                .filter(user => Object.keys(user.teams).length > 0);
            })
          );
          break;
        case 'not_checked':
          this.users = this.admin.data.pipe(
            map((users: any[]) => {
              return users
                .filter(user => (user as Object).hasOwnProperty('teams'))
                .map(user => {
                  user.teams = Object.keys(user.teams)
                    .filter(key => {
                      const url = user.teams[key].slipUrl;
                      return (
                        url && url !== '' && user.teams[key].done === false
                      );
                    })
                    .reduce(
                      (prev, current, index, array) =>
                        Object.assign(prev, { [current]: user.teams[current] }),
                      {}
                    );
                  return user;
                })
                .filter(user => Object.keys(user.teams).length > 0);
            })
          );
          break;
        case 'checked':
          this.users = this.admin.data.pipe(
            map((users: any[]) => {
              return users
                .filter(user => (user as Object).hasOwnProperty('teams'))
                .map(user => {
                  user.teams = Object.keys(user.teams)
                    .filter(key => {
                      const url = user.teams[key].slipUrl;
                      return url && url !== '' && user.teams[key].done;
                    })
                    .reduce(
                      (prev, current, index, array) =>
                        Object.assign(prev, { [current]: user.teams[current] }),
                      {}
                    );
                  return user;
                })
                .filter(user => Object.keys(user.teams).length > 0);
            })
          );
          break;
        case 'school':
          this.users = this.admin.data.pipe(
            map((users: any[]) => {
              return users
                .filter(user => (user as Object).hasOwnProperty('teams'))
                .map(user => {
                  user.teams = [];
                  return user;
                });
            })
          );
          break;
        case 'medtalk':
          this.users = this.admin.data.pipe(
            map((users: any[]) => {
              return users.filter(user =>
                (user as Object).hasOwnProperty('teams') || (user as Object).hasOwnProperty('individuals')
              );
            })
          );
          break;
        default:
          this.users = observableOf([]);
      }
    });
    this.students = this.users.pipe(map(us => {
      return us.map(u => {
        const ss: any[] = [];
        const teamKeys = Object.keys(u.teams);
        teamKeys.forEach(tk => {
          const team = u.teams[tk];
          ss.push({
            userId: u.$key,
            teamId: tk,
            student: team.student1,
            teacher: team.teacher,
            schoolDetail: u.schoolDetail
          });
          ss.push({
            userId: u.$key,
            teamId: tk,
            student: team.student2,
            teacher: team.teacher,
            schoolDetail: u.schoolDetail
          });
        });
        return ss;
      }).reduce((prev, curr, index, arr) => {
        return prev.concat(curr);
      }, [] as any[]);
    }))
  }

  trackByFn(index, item) {
    return item.$key;
  }

  toggleStatus(uid: string, tid: string, isTeam = true) {
    this.afd
      .object(`/data/${uid}/${isTeam ? 'teams' : 'individuals'}/${tid}/done`)
      .valueChanges()
      .pipe(first())
      .subscribe((v: boolean) => {
        this.afd.database.ref(`/data/${uid}/${isTeam ? 'teams' : 'individuals'}/${tid}/done`).set(!v);
      });
  }

  copyStudents() {
    this.method.subscribe(m => {
      if (m === 'medtalk') {
        this.users.pipe(map(us => {
          return us.map(u => {
            const ss: any[] = [];
            const teamKeys = Object.keys(u.teams ?? []);
            const individualKeys = Object.keys(u.individuals ?? []);
            teamKeys.forEach(tk => {
              const team = u.teams[tk];
              if (team.student1.medTalkCome === true) {
                ss.push({
                  userId: u.$key,
                  teamId: tk,
                  individualId: '',
                  student: team.student1,
                  teacher: team.teacher,
                  schoolDetail: u.schoolDetail,
                  done: team.done
                });
              }
              if (team.student2.medTalkCome === true) {
                ss.push({
                  userId: u.$key,
                  teamId: tk,
                  individualId: '',
                  student: team.student2,
                  teacher: team.teacher,
                  schoolDetail: u.schoolDetail,
                  done: team.done
                });
              }
            });
            individualKeys.forEach(ik => {
              const individual = u.individuals[ik];
              ss.push({
                userId: u.$key,
                teamId: '',
                individualId: ik,
                student: individual,
                teacher: '',
                schoolDetail: '',
                done: individual.done
              });
            });
            return ss;
          }).reduce((prev, curr, index, arr) => {
            return prev.concat(curr);
          }, [] as any[])})).subscribe(d => {
          const file = new window.Blob([JSON.stringify(d)], { type: 'application/json' });

          const url = window.URL.createObjectURL(file);

          const a = document.createElement('a');
          document.body.appendChild(a);

          a.setAttribute('style', 'display: none');
          a.href = url;
          a.download = 'data.json';
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();
          alert('Saved!');
        });
      } else {
        this.students.pipe(take(1)).subscribe(d => {
          const file = new window.Blob([JSON.stringify(d)], { type: 'application/json' });

          const url = window.URL.createObjectURL(file);

          const a = document.createElement('a');
          document.body.appendChild(a);

          a.setAttribute('style', 'display: none');
          a.href = url;
          a.download = 'data.json';
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();
          alert('Saved!');
        });
      }
    });
  }
}
