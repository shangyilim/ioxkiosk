import { Component } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  useAnimation,
  transition
} from '@angular/animations';
import { fadeOutUp } from 'ng-animate';
import { AngularFireDatabase } from 'angularfire2/database';

import { ConvoResponse } from './convo-response.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('fadeOutUp', [
      state('false', style({
        opacity: '1'
      })),
      state('true', style({
        opacity: '0'
      })),
      transition('false => true', useAnimation(fadeOutUp, { params: { timing: 0.6, a: 0, b: '-40%' } }))
    ]),
    trigger('fadeInUp', [
      state('false', style({
        opacity: '0',
        transform: 'translateY(100%)'
      })),
      state('true', style({
        opacity: '1',
        transform: 'translateY(0)'
      })),
      transition('false => true', animate('600ms 1000ms cubic-bezier(0.175, 0.885, 0.32, 1.275)'))
    ]),
  ]
})
export class AppComponent {
  title = 'app';
  hideAssistant = false;
  disableIntro = false;
  response: ConvoResponse = null;


  constructor(db: AngularFireDatabase) {

    const mainResponse: ConvoResponse = {
      speech: '',
      caption: `Say "Ok Google, mirror mirror"`,
      leftPicture: 'assets/assistant.gif',
      reset: true
    };

    this.response = mainResponse;

    db.object('settings').snapshotChanges().delay(4000).subscribe(settings => {
      console.log('settings payload', settings.payload.val());
      const greetingFound = (settings.payload.val() as any).greeting;
      if (greetingFound) {
        this.response = {
          speech: '',
          caption: `Welcome to I/O Extended Kuala Lumpur! Here's what you can do `,
          chips: [`Who's our sponsors?`,
            `When is the next talk?`,
            `What's the WiFi password?`,
            `Whats the schedule?`, `Bye!`]
        };
      } else {
        this.response = mainResponse;
      }
    });

    db.object('response').snapshotChanges().delay(8000).subscribe(response => {
      const responseValue: any = response.payload.val();
      if (responseValue) {
        if (!responseValue.chips) {
          responseValue.chips = [`Who's our sponsors?`,
            `When is the next talk?`,
            `What's the WiFi password?`,
            `Whats the schedule?`, `Bye!`];
          this.response = responseValue;
        }
      }
    });

  }
}
