import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import { AdminService } from '../admin.service';
import 'rxjs/add/observable/of';

@Component({
  selector: 'adq-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.scss']
})
export class QueryComponent implements OnInit {

  method: Observable<string>;
  users: Observable<any[]>;

  constructor(private route: ActivatedRoute, private admin: AdminService) { }

  ngOnInit() {
    this.method = this.route.params.map(params => params['method']);
    this.method.subscribe((method) => {
      switch (method) {
        case 'all':
        this.users = this.admin.data.map((users: any[]) => {
          return users.filter((user) => (user as Object).hasOwnProperty('teams'));
        });
        break;
        case 'paid':
        this.users = this.admin.data.map((users: any[]) => {
          return users.filter((user) => (user as Object).hasOwnProperty('teams'))
          .map((user) => {
            user.teams = Object.keys(user.teams).filter((key) => {
              const url = user.teams[key].slipUrl;
              return url && url !== '';
            }).reduce((prev, current, index, array) => Object.assign(prev, {[current]: user.teams[current]}), {});
            return user;
          }).filter((user) => Object.keys(user.teams).length > 0);
        });
        break;
        case 'not_checked':
        this.users = this.admin.data.map((users: any[]) => {
          return users.filter((user) => (user as Object).hasOwnProperty('teams'))
          .map((user) => {
            user.teams = Object.keys(user.teams).filter((key) => {
              const url = user.teams[key].slipUrl;
              return url && url !== '' && (user.teams[key].done === false);
            }).reduce((prev, current, index, array) => Object.assign(prev, {[current]: user.teams[current]}), {});
            return user;
          }).filter((user) => Object.keys(user.teams).length > 0);
        });
        break;
        case 'checked':
        this.users = this.admin.data.map((users: any[]) => {
          return users.filter((user) => (user as Object).hasOwnProperty('teams'))
          .map((user) => {
            user.teams = Object.keys(user.teams).filter((key) => {
              const url = user.teams[key].slipUrl;
              return url && url !== '' && user.teams[key].done;
            }).reduce((prev, current, index, array) => Object.assign(prev, {[current]: user.teams[current]}), {});
            return user;
          }).filter((user) => Object.keys(user.teams).length > 0);
        });
        break;
        case 'school':
        this.users = this.admin.data.map((users: any[]) => {
          return users.filter((user) => (user as Object).hasOwnProperty('teams'))
          .map((user) => {
            user.teams = [];
            return user;
          });
        });
        break;
        default:
        this.users = Observable.of([]);
      }
    });
  }

  trackByFn(index, item) {
    return item.$key;
  }

}
