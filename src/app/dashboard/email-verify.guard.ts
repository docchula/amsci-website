import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/do';

@Injectable()
export class EmailVerifyGuard implements CanActivate {

  constructor(private afa: AngularFireAuth, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.afa.authState.first().map((user) => user.emailVerified).do((isVerify) => {
      if (!isVerify) {
        this.router.navigate(['/dashboard', 'step1']);
      }
    });
  }
}
