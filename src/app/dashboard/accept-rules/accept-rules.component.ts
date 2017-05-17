import { Component, OnInit } from '@angular/core';
import { UserStatusService } from '../user-status.service';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/do';

@Component({
  selector: 'adq-accept-rules',
  templateUrl: './accept-rules.component.html',
  styleUrls: ['./accept-rules.component.scss']
})
export class AcceptRulesComponent implements OnInit {

  isAccepted: Observable<boolean>;

  constructor(private userStatus: UserStatusService, private afd: AngularFireDatabase, private afa: AngularFireAuth) { }

  ngOnInit() {
    this.isAccepted = this.userStatus.isAcceptedRules;
  }

  accept() {
    this.afa.authState.first().subscribe((user) => {
      this.afd.database.ref(`data/${user.uid}/accepted`).set(true);
    });
  }

}
