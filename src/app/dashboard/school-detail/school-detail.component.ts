import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { SchoolDetail } from 'app/dashboard/school-detail';
import { Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { UserStatusService } from '../user-status.service';

const schoolNameValidator: ValidatorFn = (c: AbstractControl) => {
  if (c.value && (c.value as string).startsWith('โรงเรียน')) {
    return { startsWithSchool: true };
  } else {
    return null;
  }
};

@Component({
  selector: 'adq-school-detail',
  templateUrl: './school-detail.component.html',
  styleUrls: ['./school-detail.component.scss']
})
export class SchoolDetailComponent implements OnInit, OnDestroy {
  step3Done: Observable<boolean>;
  schoolDetail: Observable<SchoolDetail>;
  schoolForm: FormGroup;
  editMode: boolean;
  schoolDetailSub: Subscription;

  constructor(
    private userStatus: UserStatusService,
    private afd: AngularFireDatabase,
    private afa: AngularFireAuth
  ) {}

  ngOnInit() {
    this.step3Done = this.userStatus.isSchoolDetailDone;
    this.schoolDetail = this.userStatus.schoolDetail;
    this.schoolForm = new FormGroup({
      name: new FormControl('', [Validators.required, schoolNameValidator]),
      address: new FormControl('', Validators.required),
      tel: new FormControl('', Validators.required)
    });
    this.schoolDetailSub = this.schoolDetail.subscribe(_schoolDetail => {
      if (_schoolDetail.$exists()) {
        this.schoolForm.get('name').setValue(_schoolDetail.name);
        this.schoolForm.get('address').setValue(_schoolDetail.address);
        this.schoolForm.get('tel').setValue(_schoolDetail.tel);
      }
    });
    this.editMode = false;
  }

  ngOnDestroy() {
    this.schoolDetailSub.unsubscribe();
  }

  submitForm() {
    if (this.schoolForm.valid) {
      this.afa.authState.pipe(first()).subscribe(user => {
        this.afd.database
          .ref(`data/${user.uid}/schoolDetail`)
          .set(this.schoolForm.value)
          .then(() => {
            this.editMode = false;
          });
      });
    }
  }

  toggleEdit() {
    this.editMode = true;
  }
}
