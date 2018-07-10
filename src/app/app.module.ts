import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatChipsModule, MatProgressSpinnerModule} from '@angular/material';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { QRCodeModule } from 'angularx-qrcode';
import { NgxKjuaModule } from 'ngx-kjua';

import { AppComponent } from './app.component';
import { CarouselComponent } from './carousel/carousel.component';

export const environment = {
  production: false,
  firebase: {
    apiKey: "revoked",
    authDomain: "iox-kiosk.firebaseapp.com",
    databaseURL: "https://iox-kiosk.firebaseio.com",
    projectId: "iox-kiosk",
    storageBucket: "iox-kiosk.appspot.com",
    messagingSenderId: "185418869912"
  }
};

@NgModule({
  declarations: [
    AppComponent,
    CarouselComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    QRCodeModule,
    NgxKjuaModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
