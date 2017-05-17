import { Injectable } from '@angular/core';
import { CanLoad, Route, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthGuard implements CanLoad, CanActivate {
  constructor(private afa: AngularFireAuth, private router: Router) {}

  isLoggedIn() {
    return this.afa.authState.first().map((user, index) => {
      if (user) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    });
  }

  canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
    return this.isLoggedIn();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.isLoggedIn();
  }
}
