import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { AdminGuard } from 'app/admin.guard';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth.guard';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [AppComponent, HomeComponent],
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
    AngularFireStorageModule,
    Angulartics2Module.forRoot()
  ],
  providers: [AuthGuard, AdminGuard],
  bootstrap: [AppComponent]
})
export class AppModule {}
