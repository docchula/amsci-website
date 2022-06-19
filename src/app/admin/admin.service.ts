import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AdminService {
  data: Observable<any>;
  // TODO: find uses of this thing
  constructor(private afd: AngularFireDatabase) {
    this.data = this.afd.list('data').snapshotChanges().pipe(
      map(snaps => {
        return snaps.map(snap => {
          return {
            $key: snap.key,
            ...snap.payload.val() as {}
          }
        })
      })
    );
  }
}
