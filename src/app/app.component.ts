import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';

@Component({
  selector: 'adq-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  authState: Observable<firebase.User>;
  constructor(
    private afa: AngularFireAuth,
    private router: Router,
    private analytics: Angulartics2GoogleAnalytics
  ) {}

  ngOnInit() {
    this.analytics.startTracking();
    this.authState = this.afa.authState;
  }

  signOut() {
    this.router.navigate(['login']).then(() => this.afa.auth.signOut());
  }
}
