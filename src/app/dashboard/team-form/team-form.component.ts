import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Team } from 'app/dashboard/team';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/filter';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FirebaseApp } from 'angularfire2';
import { Subscription } from 'rxjs/Subscription';

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
    private router: Router) { }

  ngOnInit() {
    this.editMode = this.activatedRoute.url.map((url) => url.length).map((len) => {
      if (len === 1) {
        return false;
      } else {
        return true;
      }
    });
    this.editMode.subscribe((editMode) => {
      if (editMode) {
        this.team = this.activatedRoute.params.map((params) => params['id']).mergeMap((id) => {
          return this.afa.authState.first().mergeMap((user) => this.afd.object(`data/${user.uid}/teams/${id}`))
            .filter((v) => {
              if (v) {
                return true;
              } else {
                return false;
              }
            });
        });
        this.teamSub = this.team.subscribe((_team) => {
          if (!((_team as Object).hasOwnProperty('slipUrl'))) {
            _team.slipUrl = '';
          }
          if (!((_team as Object).hasOwnProperty('slipGUID'))) {
            _team.slipGUID = '';
          }
          this.teamForm.setValue(_team);
        });
      }
    });
    this.teamForm = new FormGroup({
      teacher: new FormGroup({
        title: new FormControl(null, Validators.required),
        fname: new FormControl(null, Validators.required),
        lname: new FormControl(null, Validators.required),
        tel: new FormControl(null, Validators.required)
      }),
      student1: new FormGroup({
        title: new FormControl(null, Validators.required),
        fname: new FormControl(null, Validators.required),
        lname: new FormControl(null, Validators.required),
        tel: new FormControl(null, Validators.required),
        email: new FormControl(null, [Validators.required, Validators.email]),
        grade: new FormControl(null, Validators.required),
        pictureUrl: new FormControl(null, Validators.required),
        idCardUrl: new FormControl(null, Validators.required),
        pictureGUID: new FormControl(null, Validators.required),
        idCardGUID: new FormControl(null, Validators.required)
      }),
      student2: new FormGroup({
        title: new FormControl(null, Validators.required),
        fname: new FormControl(null, Validators.required),
        lname: new FormControl(null, Validators.required),
        tel: new FormControl(null, Validators.required),
        email: new FormControl(null, [Validators.required, Validators.email]),
        grade: new FormControl(null, Validators.required),
        pictureUrl: new FormControl(null, Validators.required),
        idCardUrl: new FormControl(null, Validators.required),
        pictureGUID: new FormControl(null, Validators.required),
        idCardGUID: new FormControl(null, Validators.required)
      }),
      slipUrl: new FormControl(),
      slipGUID: new FormControl(),
      done: new FormControl()
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
        maxSize = 120 * 1024;
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
        this.afa.authState.map((user) => user.uid).first().subscribe((uid) => {
          const fid = this.guid();
          const ref = this.fba.storage().ref(`data/${uid}/${fid}`);
          ref.put(file).then((a) => {
            this.teamForm.get(`student${student}`).get(`${type}Url`).setValue(a.downloadURL);
            this.teamForm.get(`student${student}`).get(`${type}GUID`).setValue(fid);
          });
        });
      }
    }
  }

  submit() {
    this.teamForm.get('done').setValue(false);
    this.editMode.first().subscribe((edit) => {
      if (edit) {
        this.activatedRoute.params.map((params) => params['id']).first().subscribe((tid) => {
          this.afa.authState.map((user) => user.uid).first().subscribe((uid) => {
            this.afd.database.ref(`data/${uid}/teams/${tid}`).set(this.teamForm.value).then(() => {
              this.router.navigate(['/dashboard', 'step4']);
            });
          });
        });
      } else {
        this.afa.authState.map((user) => user.uid).first().subscribe((uid) => {
          this.afd.database.ref(`data/${uid}/teams`).push(this.teamForm.value).then(() => {
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
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

}
