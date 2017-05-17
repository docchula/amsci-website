import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import 'rxjs/add/operator/first';

@Component({
  selector: 'adq-email-check',
  templateUrl: './email-check.component.html',
  styleUrls: ['./email-check.component.scss']
})
export class EmailCheckComponent implements OnInit {

  user: Observable<firebase.User>;
  emailVerified: Observable<boolean>;

  constructor(private afa: AngularFireAuth) { }

  ngOnInit() {
    this.user = this.afa.authState;
    this.emailVerified = this.user.map((as) => as.emailVerified);
  }

  resendEmail() {
    this.user.first().subscribe((user) => {
      user.sendEmailVerification();
    });
  }

}
