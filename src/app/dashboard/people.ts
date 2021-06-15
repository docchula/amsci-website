export interface People {
  $key: string;
  title: string;
  fname: string;
  lname: string;
  tel: string;
  slipUrl?: string;
  slipGUID?: string;
  accountNumberDigits?: number;
  transferTime?: string;
  done?: boolean;
}
