import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
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
    private router: Router
  ) {}

  ngOnInit() {
    this.authState = this.afa.authState;
  }

  signOut() {
    this.router.navigate(['login']).then(() => this.afa.signOut());
  }
}
