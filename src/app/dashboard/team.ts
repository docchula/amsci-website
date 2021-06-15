import { People } from 'app/dashboard/people';
import { Student } from 'app/dashboard/student';

export interface Team {
  teacher?: People;
  student1?: Student;
  student2?: Student;
  slipUrl?: string;
  slipGUID?: string;
  accountNumberDigits?: number;
  transferTime?: string;
  $key: string;
  done?: boolean;
  cardFile?: string;
  scoreFile?: string;
}
