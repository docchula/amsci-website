import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Route, Router, RouterStateSnapshot } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { first, map, mergeMap, tap } from 'rxjs/operators';

@Injectable()
export class AdminGuard  {
  constructor(
    private afd: AngularFireDatabase,
    private afa: AngularFireAuth,
    private router: Router
  ) {}

  canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
    return this.isAdmin();
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.isAdmin();
  }
  // TODO: Check this method
  isAdmin(): Observable<boolean> {
    return this.afa.authState.pipe(
      map(user => user.uid),
      first(),
      mergeMap((uid, index) => {
        return this.afd.object(`/admins/${uid}`).snapshotChanges();
      }),
      first(),
      map(s => {
        return {
          $value: {
            ...s.payload.val() as {}
          },
          $exists: s.payload.exists()
        };
      }),
      map(v => {
        if (v.$exists) {
          return !!v.$value;
        } else {
          return false;
        }
      }),
      tap(v => {
        if (!v) {
          this.router.navigate(['/']);
        }
      })
    );
  }
}
