import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseApp } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { Team } from 'app/dashboard/team';
import {combineLatest, Observable, Subject, Subscription} from 'rxjs';
import { filter, first, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'adq-team-form',
  templateUrl: './team-form.component.html',
  styleUrls: ['./team-form.component.scss']
})
export class TeamFormComponent implements OnInit, OnDestroy {
  editMode: Observable<boolean>;
  team: Observable<Team>;
  teamForm: FormGroup;
  teamSub: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private afa: AngularFireAuth,
    private afd: AngularFireDatabase,
    private fba: FirebaseApp,
    private router: Router
  ) {}

  ngOnInit() {
    this.editMode = this.activatedRoute.url.pipe(
      map(url => url.length),
      map(len => {
        if (len === 1) {
          return false;
        } else {
          return true;
        }
      })
    );
    this.editMode.subscribe(editMode => {
      if (editMode) {
        this.team = combineLatest([this.activatedRoute.params, this.afa.authState]).pipe(
          map(results => {
            return [results[0]['id'], results[1]];
          }),
          mergeMap(([id, user]) => {
            return this.afd.object<Team>(`data/${user.uid}/teams/${id}`).valueChanges();
          }),
          filter(v => {
            if (v) {
              return true;
            } else {
              return false;
            }
          })
        );
        this.teamSub = this.team.subscribe(_team => {
          if (!(_team as Object).hasOwnProperty('slipUrl')) {
            _team.slipUrl = '';
          }
          if (!(_team as Object).hasOwnProperty('slipGUID')) {
            _team.slipGUID = '';
          }
          if ((_team as Object).hasOwnProperty('cardFile')) {
            delete _team.cardFile;
          }

          if (!(_team.student1 as Object).hasOwnProperty('pictureUrl')) {
            _team.student1.pictureUrl = '';
          }
          if (!(_team.student2 as Object).hasOwnProperty('pictureUrl')) {
            _team.student2.pictureUrl = '';
          }
          if (!(_team.student1 as Object).hasOwnProperty('pictureGUID')) {
            _team.student1.pictureGUID = '';
          }
          if (!(_team.student2 as Object).hasOwnProperty('pictureGUID')) {
            _team.student2.pictureGUID = '';
          }

          if (!(_team.student1 as Object).hasOwnProperty('medTalkCome')) {
            _team.student1.medTalkCome = null;
            _team.student1.medTalkConfirmed = false;
          }
          if (!(_team.student2 as Object).hasOwnProperty('medTalkCome')) {
            _team.student2.medTalkCome = null;
            _team.student2.medTalkConfirmed = false;
          }

          if (!(_team as Object).hasOwnProperty('accountNumberDigits')) {
            _team.accountNumberDigits = null;
          }
          if (!(_team as Object).hasOwnProperty('transferTime')) {
            _team.transferTime = '';
          }

          this.teamForm.setValue(_team);
        });
      }
    });
    this.teamForm = new FormGroup({
      teacher: new FormGroup({
        title: new FormControl(null, Validators.nullValidator),
        fname: new FormControl(null, Validators.nullValidator),
        lname: new FormControl(null, Validators.nullValidator),
        tel: new FormControl(null, Validators.nullValidator)
      }),
      student1: new FormGroup({
        title: new FormControl(null, Validators.required),
        fname: new FormControl(null, Validators.required),
        lname: new FormControl(null, Validators.required),
        tel: new FormControl(null, Validators.required),
        email: new FormControl(null, [Validators.required, Validators.email]),
        grade: new FormControl(null, Validators.required),
        pictureUrl: new FormControl(null, Validators.nullValidator),
        idCardUrl: new FormControl(null, Validators.required),
        pictureGUID: new FormControl(null, Validators.nullValidator),
        idCardGUID: new FormControl(null, Validators.required),
        medTalkConfirmed: new FormControl(),
        medTalkCome: new FormControl(),
      }),
      student2: new FormGroup({
        title: new FormControl(null, Validators.required),
        fname: new FormControl(null, Validators.required),
        lname: new FormControl(null, Validators.required),
        tel: new FormControl(null, Validators.required),
        email: new FormControl(null, [Validators.required, Validators.email]),
        grade: new FormControl(null, Validators.required),
        pictureUrl: new FormControl(null, Validators.nullValidator),
        idCardUrl: new FormControl(null, Validators.required),
        pictureGUID: new FormControl(null, Validators.nullValidator),
        idCardGUID: new FormControl(null, Validators.required),
        medTalkConfirmed: new FormControl(),
        medTalkCome: new FormControl(),
      }),
      slipUrl: new FormControl(),
      slipGUID: new FormControl(),
      done: new FormControl(),
      accountNumberDigits: new FormControl(),
      transferTime: new FormControl()
    });
  }

  ngOnDestroy() {
    if (this.teamSub) {
      this.teamSub.unsubscribe();
    }
  }

  selectedFile(student: number, type: 'picture' | 'idCard', input: any) {
    let maxSize: number;
    switch (type) {
      case 'picture':
        maxSize = 400 * 1024;
        break;
      case 'idCard':
        maxSize = 400 * 1024;
        break;
      default:
        maxSize = 0;
    }
    if (input.files && input.files[0]) {
      const file = input.files[0] as File;
      if (file.size > maxSize) {
        alert(`กรุณาอัพโหลดไฟล์ที่มีขนาดต่ำกว่า ${maxSize / 1024} กิโลไบต์`);
        input.value = '';
      } else {
        const ok = new Subject<boolean>();
        if (type === 'picture') {
          const fr = new FileReader();

          fr.readAsDataURL(input.files[0]);

          fr.onload = e => {
            const img = new Image();
            img.src = (e.target as FileReader).result as string;
            img.onload = () => {
              this.afa.authState
                .pipe(map(user => user.uid), first())
                .subscribe(uid => {
                  const fid = this.guid();
                  const ref = this.fba.storage().ref(`data/${uid}/${fid}`);
                  ref.put(file).then(a => {
                    ref.getDownloadURL().then(dl => {
                      this.teamForm
                        .get(`student${student}`)
                        .get(`${type}Url`)
                        .setValue(dl);
                    });
                    this.teamForm
                      .get(`student${student}`)
                      .get(`${type}GUID`)
                      .setValue(fid);
                  });
                });
            };
          };
        } else {
          this.afa.authState
            .pipe(map(user => user.uid), first())
            .subscribe(uid => {
              const fid = this.guid();
              const ref = this.fba.storage().ref(`data/${uid}/${fid}`);
              ref.put(file).then(a => {
                ref.getDownloadURL().then(dl => {
                  this.teamForm
                  .get(`student${student}`)
                  .get(`${type}Url`)
                  .setValue(dl);
                })
                this.teamForm
                  .get(`student${student}`)
                  .get(`${type}GUID`)
                  .setValue(fid);
              });
            });
        }
      }
    }
  }

  submit() {
    this.teamForm.get('done').setValue(false);
    this.editMode.pipe(first()).subscribe(edit => {
      if (edit) {
        this.activatedRoute.params
          .pipe(map(params => params['id']), first())
          .subscribe(tid => {
            this.afa.authState
              .pipe(map(user => user.uid), first())
              .subscribe(uid => {
                this.afd.database
                  .ref(`data/${uid}/teams/${tid}`)
                  .set(this.teamForm.value)
                  .then(() => {
                    this.router.navigate(['/dashboard', 'step4']);
                  });
              });
          });
      } else {
        this.afa.authState
          .pipe(map(user => user.uid), first())
          .subscribe(uid => {
            this.afd.database
              .ref(`data/${uid}/teams`)
              .push(this.teamForm.value)
              .then(() => {
                this.router.navigate(['/dashboard', 'step4']);
              });
          });
      }
    });
  }

  private guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return (
      s4() +
      s4() +
      '-' +
      s4() +
      '-' +
      s4() +
      '-' +
      s4() +
      '-' +
      s4() +
      s4() +
      s4()
    );
  }
}
