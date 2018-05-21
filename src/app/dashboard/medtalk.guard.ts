import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { UserStatusService } from 'app/dashboard/user-status.service';
import { Observable } from 'rxjs';
import { first, tap } from 'rxjs/operators';

@Injectable()
export class MedtalkGuard implements CanActivate {
  constructor(private userStatus: UserStatusService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.userStatus.medTalk.pipe(
      first(),
      tap(v => {
        if (!v) {
          this.router.navigate(['/dashboard', 'medtalk']);
        }
      })
    );
  }
}
