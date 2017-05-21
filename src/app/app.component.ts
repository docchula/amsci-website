import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { Angulartics2GoogleAnalytics } from 'angulartics2';

@Component({
  selector: 'adq-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  authState: Observable<firebase.User>;
  constructor(private afa: AngularFireAuth, private router: Router, private analytics: Angulartics2GoogleAnalytics) { }

  ngOnInit() {
    this.authState = this.afa.authState;
  }

  signOut() {
    this.router.navigate(['login']).then(() => this.afa.auth.signOut());
  }
}
