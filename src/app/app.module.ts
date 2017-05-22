import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth.guard';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { Angulartics2Module, Angulartics2GoogleAnalytics } from 'angulartics2';
import 'firebase/storage';
import { AdminGuard } from 'app/admin.guard';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp({
      apiKey: 'AIzaSyAtUkMIelYmZxmnB5ELfRmmc3lR82ZulTc',
      authDomain: 'anandayquiz.firebaseapp.com',
      databaseURL: 'https://anandayquiz.firebaseio.com',
      projectId: 'anandayquiz',
      storageBucket: 'anandayquiz.appspot.com',
      messagingSenderId: '789856352031'
    }),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    Angulartics2Module.forRoot([Angulartics2GoogleAnalytics])
  ],
  providers: [AuthGuard, AdminGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
