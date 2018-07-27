import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { first } from 'rxjs/operators';

interface SignInFormValue {
  email: string;
  password: string;
}

interface RegistrationFormValue {
  email: string;
  passwords: {
    password: string;
    passwordConfirmation: string;
  };
}

function confirmationValidator(
  passName: string,
  confirmName: string
): ValidatorFn {
  return (form: FormGroup): { [key: string]: any } => {
    const pass = form.get(passName),
      confirm = form.get(confirmName);
    if (pass.value !== confirm.value) {
      return { confirmation: true };
    } else {
      return null;
    }
  };
}

@Component({
  selector: 'adq-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  signInForm: FormGroup;
  registrationForm: FormGroup;
  alertMessage: string;
  alertClass: string;
  alertShow: boolean;

  constructor(public afa: AngularFireAuth, private router: Router) {}

  ngOnInit() {
    this.signInForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
    this.registrationForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      passwords: new FormGroup(
        {
          password: new FormControl('', [
            Validators.required,
            Validators.minLength(8)
          ]),
          passwordConfirmation: new FormControl('')
        },
        confirmationValidator('password', 'passwordConfirmation')
      )
    });
    this.alertMessage = '';
    this.alertClass = 'success';
    this.alertShow = false;
    this.afa.authState.pipe(first()).subscribe(user => {
      if (user) {
        this.router.navigate(['dashboard']);
      }
    });
  }

  onSignIn() {
    const formValue: SignInFormValue = this.signInForm.value;
    if (this.signInForm.valid) {
      this.afa.auth
        .signInWithEmailAndPassword(formValue.email, formValue.password)
        .then(
          (user: firebase.auth.UserCredential) => {
            this.router.navigate(['dashboard']);
          },
          err => console.log(err.message)
        );
    }
  }

  register() {
    const formValue: RegistrationFormValue = this.registrationForm.value;
    if (this.registrationForm.valid) {
      this.afa.auth
        .createUserWithEmailAndPassword(
          formValue.email,
          formValue.passwords.password
        )
        .then(
          (userCredential: firebase.auth.UserCredential) => {
            userCredential.user.sendEmailVerification();
            this.router.navigate(['/dashboard']);
          },
          err => {
            const realErr: any = err;
            let message = '';
            switch (realErr.code) {
              case 'auth/email-already-in-use':
                message = 'อีเมลนี้มีผู้ใช้งานแล้ว';
                break;
              case 'auth/invalid-email':
                message = 'อีเมลไม่ถูกต้อง';
                break;
              case 'auth/operation-not-allowed':
                message = 'ไม่อนุญาตให้ทำการสมัครในตอนนี้';
                break;
              case 'auth/weak-password':
                message = 'รหัสผ่านสามารถคาดเดาได้ง่ายเกินไป';
                break;
              default:
                message = 'เกิดปัญหาที่ไม่อาจทราบได้';
            }
            this.showAlert(message);
          }
        );
    }
  }

  showAlert(message: string, alertClass: string = 'danger') {
    this.alertMessage = message;
    this.alertClass = alertClass;
    this.alertShow = true;
  }

  closeAlert() {
    this.alertShow = false;
  }
}
