import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/do';
import { UserStatusService } from 'app/dashboard/user-status.service';

@Injectable()
export class EmailVerifyGuard implements CanActivate {

  constructor(private userStatus: UserStatusService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.userStatus.isEmailVerified.do((isVerify) => {
      if (!isVerify) {
        this.router.navigate(['/dashboard', 'step1']);
      }
    });
  }
}
