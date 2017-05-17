import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/mergeMap';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserStatusService {

  isEmailVerified: Observable<boolean>;
  isAcceptedRules: Observable<boolean>;

  constructor(private afa: AngularFireAuth, private afd: AngularFireDatabase) {
    this.isEmailVerified = this.afa.authState.map((user) => user.emailVerified);
    this.isAcceptedRules = this.afa.authState.first().mergeMap((user) => this.afd.object(`/data/${user.uid}/accepted`))
    .map((accepted) => {
      if (accepted) {
        return accepted.$value;
      } else {
        return false;
      }
    });
  }

}
