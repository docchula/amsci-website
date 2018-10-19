import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { first, mergeMap, switchMap } from 'rxjs/operators';

@Component({
  selector: 'adq-view-team',
  templateUrl: './view-team.component.html',
  styleUrls: ['./view-team.component.scss']
})
export class ViewTeamComponent implements OnInit {
  params: Observable<Params>;
  team: Observable<any>;
  schoolDetail: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private afd: AngularFireDatabase,
    private location: Location
  ) {}

  ngOnInit() {
    this.params = this.route.params;
    this.team = this.params.pipe(
      switchMap(params =>
        this.afd.object(`/data/${params['uid']}/teams/${params['tid']}`).valueChanges()
      )
    );
    this.schoolDetail = this.params.pipe(
      switchMap(params =>
        this.afd.object(`/data/${params['uid']}/schoolDetail`).valueChanges()
      )
    );
  }

  toggleStatus() {
    let uid, tid: string;
    this.params
      .pipe(
        first(),
        mergeMap(params => {
          uid = params['uid'];
          tid = params['tid'];
          return this.afd.object(
            `/data/${params['uid']}/teams/${params['tid']}/done`
          ).valueChanges();
        }),
        first()
      )
      .subscribe((v: boolean) => {
        this.afd.database.ref(`/data/${uid}/teams/${tid}/done`).set(!v);
      });
  }

  goBack() {
    this.location.back();
  }
}
