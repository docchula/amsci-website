import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UserStatusService } from 'app/dashboard/user-status.service';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/first';

@Injectable()
export class AcceptGuard implements CanActivate {

  constructor(private userStatus: UserStatusService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.userStatus.isAcceptedRules.first().do((isAccepted) => {
      if (!isAccepted) {
        console.log('asdf');
        this.router.navigate(['/dashboard', 'step2']);
      }
    });
  }
}
