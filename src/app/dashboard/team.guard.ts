import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UserStatusService } from 'app/dashboard/user-status.service';

@Injectable()
export class TeamGuard implements CanActivate {

  constructor(private userStatus: UserStatusService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.userStatus.hasTeams.first().do((v) => {
      if (!v) {
        this.router.navigate(['/dashboard', 'step4']);
      }
    });
  }
}
