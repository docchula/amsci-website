import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';

@Injectable()
export class AdminService {
  data: Observable<any>;
  // TODO: find uses of this thing
  constructor(private afd: AngularFireDatabase) {
    this.data = this.afd.list('data').valueChanges();
  }
}
