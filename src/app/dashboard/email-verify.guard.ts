import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { UserStatusService } from 'app/dashboard/user-status.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class EmailVerifyGuard  {
  constructor(private userStatus: UserStatusService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.userStatus.isEmailVerified.pipe(
      tap(isVerify => {
        if (!isVerify) {
          this.router.navigate(['/dashboard', 'step1']);
        }
      })
    );
  }
}
