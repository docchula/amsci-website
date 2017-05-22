import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/do';

@Injectable()
export class AdminGuard implements CanLoad, CanActivate {
  constructor(private afd: AngularFireDatabase, private afa: AngularFireAuth, private router: Router) {}

  canLoad(
    route: Route): Observable<boolean> | Promise<boolean> | boolean {
    return this.isAdmin();
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.isAdmin();
  }

  isAdmin(): Observable<boolean> {
    return this.afa.authState.map((user) => user.uid).first().mergeMap((uid, index) => {
      return this.afd.object(`/admins/${uid}`);
    }).first().map((v) => {
      if (v.$exists) {
        return v.$value;
      } else {
        return false;
      }
    }).do((v) => {
      if (!v) {
        this.router.navigate(['/']);
      }
    });
  }
}
