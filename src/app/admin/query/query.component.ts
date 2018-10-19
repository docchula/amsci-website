import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable, of as observableOf } from 'rxjs';
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
              return users
                .filter(user => (user as Object).hasOwnProperty('teams'))
                .map(user => {
                  user.teams = Object.keys(user.teams)
                    .filter(key => {
                      return !!user.teams[key].medTalkCome;
                    })
                    .reduce((prev, current, index, array) => {
                      return Object.assign(prev, {
                        [current]: user.teams[current]
                      });
                    }, {});
                  return user;
                })
                .filter(user => Object.keys(user.teams).length > 0);
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

  toggleStatus(uid: string, tid: string) {
    this.afd
      .object(`/data/${uid}/teams/${tid}/done`)
      .valueChanges()
      .pipe(first())
      .subscribe((v: boolean) => {
        this.afd.database.ref(`/data/${uid}/teams/${tid}/done`).set(!v);
      });
  }

  copyStudents() {
    this.students.pipe(take(1)).subscribe(a => {
      this.clipboard.copyFromContent(JSON.stringify(a));
      alert('Copied');
    });
  }
}
