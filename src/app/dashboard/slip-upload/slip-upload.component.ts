import { Component, OnInit } from '@angular/core';
import { FirebaseApp } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Team } from 'app/dashboard/team';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { UserStatusService } from '../user-status.service';

@Component({
  selector: 'adq-slip-upload',
  templateUrl: './slip-upload.component.html',
  styleUrls: ['./slip-upload.component.scss']
})
export class SlipUploadComponent implements OnInit {
  teams: Observable<Team[]>;

  constructor(
    private userStatus: UserStatusService,
    private afa: AngularFireAuth,
    private fba: FirebaseApp,
    private afd: AngularFireDatabase
  ) {}

  ngOnInit() {
    this.teams = this.userStatus.teams;
  }

  selectedFile(input: any, key: string) {
    const maxSize = 500 * 1024;
    if (input.files && input.files[0]) {
      const file = input.files[0] as File;
      if (file.size > maxSize) {
        alert(`กรุณาอัพโหลดไฟล์ที่มีขนาดต่ำกว่า ${maxSize / 1024} กิโลไบต์`);
        input.value = '';
      } else {
        this.afa.authState
          .pipe(map(user => user.uid), first())
          .subscribe(uid => {
            const fid = this.guid();
            const ref = this.fba.storage().ref(`data/${uid}/${fid}`);
            ref.put(file).then(a => {
              ref.getDownloadURL().then(dl => {
                this.afd.database
                .ref(`data/${uid}/teams/${key}/slipUrl`)
                .set(dl);
              });
              this.afd.database
                .ref(`data/${uid}/teams/${key}/slipGUID`)
                .set(fid);
            });
          });
      }
    }
  }

  private guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return (
      s4() +
      s4() +
      '-' +
      s4() +
      '-' +
      s4() +
      '-' +
      s4() +
      '-' +
      s4() +
      s4() +
      s4()
    );
  }
}
