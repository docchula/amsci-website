import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { UserStatusService } from 'app/dashboard/user-status.service';
import { Observable } from 'rxjs';
import { first, tap } from 'rxjs/operators';

@Injectable()
export class SchoolDetailGuard  {
  constructor(private userStatus: UserStatusService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.userStatus.isSchoolDetailDone.pipe(
      first(),
      tap(v => {
        if (!v) {
          this.router.navigate(['/dashboard', 'step3']);
        }
      })
    );
  }
}
