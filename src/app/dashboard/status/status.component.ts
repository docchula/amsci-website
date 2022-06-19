import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { SchoolDetail } from 'app/dashboard/school-detail';
import { Team } from 'app/dashboard/team';
import {forkJoin, Observable, of} from 'rxjs';
import { first, shareReplay } from 'rxjs/operators';
import { UserStatusService } from '../user-status.service';
import {People} from '../people';

@Component({
  selector: 'adq-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {
  teams: Observable<Team[]>;
  individuals: Observable<People[]>;
  detail: Observable<SchoolDetail>;
  hasTeams: Observable<boolean>;
  hasIndividuals: Observable<boolean>;
  cardUrls: Observable<string>[];
  canDownloadCard: Observable<boolean>;
  canDownloadScore: Observable<boolean>;
  scoreUrls: any[];

  constructor(
    private userStatus: UserStatusService,
    private afd: AngularFireDatabase,
    private afs: AngularFireStorage
  ) {}

  ngOnInit() {
    this.teams = this.userStatus.teams;
    this.detail = this.userStatus.schoolDetail;
    this.hasTeams = this.userStatus.hasTeams;
    this.hasIndividuals = this.userStatus.hasIndividuals;
    this.cardUrls = [];
    this.scoreUrls = [];
    this.teams.pipe(first()).subscribe(teams => {
      teams.forEach(team => {
        this.cardUrls.push(
          this.afs.ref(`/cards/${team.$key}.pdf`).getDownloadURL()
        );
        this.scoreUrls.push(
          [
            this.afs.ref(`/scores/${team.$key}.1.pdf`).getDownloadURL(),
            this.afs.ref(`/scores/${team.$key}.2.pdf`).getDownloadURL()
          ]
        );
      });
    });
    this.individuals = this.userStatus.individuals;
    this.canDownloadCard = this.afd
      .object<boolean>('config/canDownloadCard')
      .valueChanges().pipe(shareReplay());
    this.canDownloadScore = this.afd
      .object<boolean>('config/canDownloadScore')
      .valueChanges().pipe(shareReplay());
  }
}
