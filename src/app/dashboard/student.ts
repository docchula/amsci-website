import { People } from 'app/dashboard/people';

export interface Student extends People {
  grade: string;
  email: string;
  pictureUrl: string;
  idCardUrl: string;
  pictureGUID: string;
  idCardGUID: string;
  medTalkConfirmed?: boolean;
  medTalkCome?: boolean;
  done?: boolean;
}
