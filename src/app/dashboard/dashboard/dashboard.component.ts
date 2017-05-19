import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { UserStatusService } from '../user-status.service';

@Component({
  selector: 'adq-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  step1Done: Observable<boolean>;
  step2Done: Observable<boolean>;
  step3Done: Observable<boolean>;
  step4Done: Observable<boolean>;
  step5Done: Observable<boolean>;

  constructor(private afa: AngularFireAuth, private userStatus: UserStatusService) { }

  ngOnInit() {
    this.step1Done = this.afa.authState.map((u, i) => u.emailVerified);
    this.step2Done = this.userStatus.isAcceptedRules;
    this.step3Done = this.userStatus.isSchoolDetailDone;
    this.step4Done = this.userStatus.hasTeams;
    this.step5Done = this.userStatus.slipUploaded;
  }

}
