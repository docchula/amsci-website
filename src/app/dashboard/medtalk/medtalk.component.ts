import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Team } from '../team';
import { UserStatusService } from '../user-status.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import {map, first, shareReplay} from 'rxjs/operators';
import {People} from '../people';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {AngularFireStorage} from '@angular/fire/compat/storage';

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
  allowCertDownload: Observable<boolean>;
  addPersonForm: UntypedFormGroup;
  individualCerts: Observable<string>[];
  teamCerts: any[];

  constructor(
    private userStatus: UserStatusService,
    private afa: AngularFireAuth,
    private afd: AngularFireDatabase,
    private afs: AngularFireStorage
  ) {}

  ngOnInit() {
    this.teams = this.userStatus.teams;
    this.medtalkDone = this.userStatus.medTalk;
    this.individuals = this.userStatus.individuals;
    this.addPersonForm = new UntypedFormGroup({
      title: new UntypedFormControl('', [Validators.required]),
      fname: new UntypedFormControl('', [Validators.required]),
      lname: new UntypedFormControl('', [Validators.required]),
      tel: new UntypedFormControl('', Validators.required)
    });
    this.medtalkOpen = this.afd
      .object<boolean>('config/medTalkOpen')
      .valueChanges().pipe(shareReplay());
    this.allowCertDownload = this.afd
      .object<boolean>('config/allowCertDownload')
      .valueChanges().pipe(shareReplay());
    this.teamCerts = [];
    this.individualCerts = [];
    this.teams.pipe(first()).subscribe(teams => {
      teams.forEach(team => {
        this.teamCerts.push(
          [
            this.afs.ref(`/medtalkCerts/${team.$key}.1.pdf`).getDownloadURL(),
            this.afs.ref(`/medtalkCerts/${team.$key}.2.pdf`).getDownloadURL()
          ]
        );
      });
    });
    this.individuals.pipe(first()).subscribe(individuals => {
      individuals.forEach(individual => {
        this.individualCerts.push(
          this.afs.ref(`/medtalkCerts/${individual.$key}.pdf`).getDownloadURL()
        );
      });
    });
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
