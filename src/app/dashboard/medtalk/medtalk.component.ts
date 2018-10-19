import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Team } from '../team';
import { UserStatusService } from '../user-status.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { map, first } from 'rxjs/operators';

@Component({
  selector: 'adq-medtalk',
  templateUrl: './medtalk.component.html',
  styleUrls: ['./medtalk.component.scss']
})
export class MedtalkComponent implements OnInit {
  teams: Observable<Team[]>;
  medtalkDone: Observable<boolean>;

  constructor(
    private userStatus: UserStatusService,
    private afa: AngularFireAuth,
    private afd: AngularFireDatabase
  ) {}

  ngOnInit() {
    this.teams = this.userStatus.teams;
    this.medtalkDone = this.userStatus.medTalk;
  }

  confirm(key: string, come: boolean) {
    if (come === true) {
      alert('ขออภัย ขณะนี้ที่นั่งในการเข้าฟัง MEDTalk เต็มแล้ว');
      come = false;
    }
    this.afa.authState.pipe(map(user => user.uid), first()).subscribe(uid => {
      this.afd.database
        .ref(`data/${uid}/teams/${key}/medTalkConfirmed`)
        .set(true);
      this.afd.database
        .ref(`data/${uid}/teams/${key}/medTalkCome`)
        .set(come);
    });
  }
}
