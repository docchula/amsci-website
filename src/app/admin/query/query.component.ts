import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable, of as observableOf } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { AdminService } from '../admin.service';

@Component({
  selector: 'adq-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.scss']
})
export class QueryComponent implements OnInit {
  method: Observable<string>;
  users: Observable<any[]>;

  constructor(
    private route: ActivatedRoute,
    private admin: AdminService,
    private afd: AngularFireDatabase
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
        default:
          this.users = observableOf([]);
      }
    });
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
}
