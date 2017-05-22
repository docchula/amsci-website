import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AdminService {

  data: Observable<any>;

  constructor(private afd: AngularFireDatabase) {
    this.data = this.afd.list('data');
  }

}
