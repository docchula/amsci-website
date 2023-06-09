import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Route, Router, RouterStateSnapshot } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

@Injectable()
export class AuthGuard  {
  constructor(private afa: AngularFireAuth, private router: Router) {}

  isLoggedIn() {
    return this.afa.authState.pipe(
      first(),
      map((user, index) => {
        if (user) {
          return true;
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }

  canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
    return this.isLoggedIn();
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.isLoggedIn();
  }
}
