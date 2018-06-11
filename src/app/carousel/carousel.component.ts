import { Component, OnInit, Input } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  useAnimation,
  transition,
  keyframes
} from '@angular/animations';

import { ConvoResponse } from '../convo-response.interface';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
  animations: [
    trigger('fadeOutUpAndFadeInFromBottom', [
      state('original', style({
        opacity: 1
      })),
      transition('original => fade_out', [
        animate('600ms cubic-bezier(0.445, 0.05, 0.55, 0.95)', keyframes([
          style({ opacity: 1, transform: 'translateY(0)', offset: 0 }),
          style({ opacity: 0, transform: 'translateY(-100%)', offset: 1 }),
        ]))
      ]),
      state('fade_out', style({
        opacity: 0,
        transform: 'translateY(100&)'
      })),
      transition('fade_out => original', [
        animate('600ms cubic-bezier(0.445, 0.05, 0.55, 0.95)', keyframes([
          style({ opacity: 0, transform: 'translateY(100%)', offset: 0 }),
          style({ opacity: 1, transform: 'translateY(0)', offset: 1 }),
        ]))
      ])])]
})

export class CarouselComponent implements OnInit {

  isFirstTime = true;
  instruction = "original";

  _convoResponse: ConvoResponse;
  get convoResponse(): ConvoResponse {
    return this._convoResponse;
  }
  @Input()
  set convoResponse(value: ConvoResponse) {
    console.log('value is set', value);
    if(!value){
      this._convoResponse = value;
      return;
    }
    if (this.isFirstTime) {
      this.isFirstTime = false;
      this._convoResponse = value;
    }
    else {
      this.instruction = 'fade_out';
      setTimeout(() => {
        this._convoResponse = value;
        this.instruction = 'original';
      }, 1000);
    }
  }
  constructor() { }

  ngOnInit() {
  }

}
