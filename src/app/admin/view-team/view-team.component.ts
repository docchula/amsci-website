import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Params } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import { Location } from '@angular/common';

@Component({
  selector: 'adq-view-team',
  templateUrl: './view-team.component.html',
  styleUrls: ['./view-team.component.scss']
})
export class ViewTeamComponent implements OnInit {

  params: Observable<Params>;
  team: Observable<any>;
  schoolDetail: Observable<any>;

  constructor(private route: ActivatedRoute, private afd: AngularFireDatabase, private location: Location) { }

  ngOnInit() {
    this.params = this.route.params;
    this.team = this.params.switchMap((params) => this.afd.object(`/data/${params['uid']}/teams/${params['tid']}`));
    this.schoolDetail = this.params.switchMap((params) => this.afd.object(`/data/${params['uid']}/schoolDetail`));
  }

  toggleStatus() {
    let uid, tid: string;
    this.params.first().mergeMap((params) => {
      uid = params['uid'];
      tid = params['tid'];
      return this.afd.object(`/data/${params['uid']}/teams/${params['tid']}/done`);
    })
    .map((v) => v.$value).first().subscribe((v: boolean) => {
      this.afd.database.ref(`/data/${uid}/teams/${tid}/done`).set(!v);
    });
  }

  goBack() {
    this.location.back();
  }

}
