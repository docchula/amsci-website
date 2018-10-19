import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

@Component({
  selector: 'adq-email-check',
  templateUrl: './email-check.component.html',
  styleUrls: ['./email-check.component.scss']
})
export class EmailCheckComponent implements OnInit {
  user: Observable<firebase.User>;
  emailVerified: Observable<boolean>;

  constructor(private afa: AngularFireAuth) {}

  ngOnInit() {
    this.user = this.afa.authState;
    this.emailVerified = this.user.pipe(map(as => as.emailVerified));
  }

  resendEmail() {
    this.user.pipe(first()).subscribe(user => {
      user.sendEmailVerification();
    });
  }
}
