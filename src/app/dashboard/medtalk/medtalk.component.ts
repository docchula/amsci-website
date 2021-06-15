import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Team } from '../team';
import { UserStatusService } from '../user-status.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import {map, first, shareReplay} from 'rxjs/operators';
import {People} from '../people';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'adq-medtalk',
  templateUrl: './medtalk.component.html',
  styleUrls: ['./medtalk.component.scss']
})
export class MedtalkComponent implements OnInit {
  teams: Observable<Team[]>;
  individuals: Observable<People[]>;
  medtalkDone: Observable<boolean>;
  medtalkOpen: Observable<boolean>;
  addPersonForm: FormGroup;

  constructor(
    private userStatus: UserStatusService,
    private afa: AngularFireAuth,
    private afd: AngularFireDatabase
  ) {}

  ngOnInit() {
    this.teams = this.userStatus.teams;
    this.medtalkDone = this.userStatus.medTalk;
    this.individuals = this.userStatus.individuals;
    this.addPersonForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      fname: new FormControl('', [Validators.required]),
      lname: new FormControl('', [Validators.required]),
      tel: new FormControl('', Validators.required)
    });
    this.medtalkOpen = this.afd
      .object<boolean>('config/medTalkOpen')
      .valueChanges().pipe(shareReplay());
  }

  confirm(teamKey: string, student: number, come: boolean) {
    // if (come === true) {
    //   alert('ขออภัย ขณะนี้ที่นั่งในการเข้าฟัง MEDTalk เต็มแล้ว');
    //   come = false;
    // }
    this.afa.authState.pipe(map(user => user.uid), first()).subscribe(uid => {
      this.afd.database
        .ref(`data/${uid}/teams/${teamKey}/student${student}/medTalkConfirmed`)
        .set(true);
      this.afd.database
        .ref(`data/${uid}/teams/${teamKey}/student${student}/medTalkCome`)
        .set(come);
    });
  }

  deletePerson(personKey: string) {
    this.afa.authState.pipe(map(user => user.uid), first()).subscribe(uid => {
      this.afd.database
        .ref(`data/${uid}/individuals/${personKey}`)
        .remove();
    });
  }

  addPerson() {
    if (this.addPersonForm.valid) {
      this.afa.authState.pipe(first()).subscribe(user => {
        this.afd.database
          .ref(`data/${user.uid}/individuals`)
          .push(this.addPersonForm.value)
      });
    }
  }
}
