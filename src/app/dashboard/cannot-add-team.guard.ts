import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CannotAddTeamGuard implements CanActivate {
  constructor(private afd: AngularFireDatabase) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.afd
      .object<boolean>('config/canAddTeam')
      .valueChanges()
      .pipe(
        tap(v => {
          if (!v) {
            alert('ไม่สามารถเพิ่มทีมได้');
          }
        })
      );
  }
}
