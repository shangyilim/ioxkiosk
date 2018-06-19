import { Component, OnInit, Input } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  group,
  query,
  stagger,
  transition,
  animateChild,
} from '@angular/animations';

import { ConvoResponse } from '../convo-response.interface';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  animations: [
    trigger('responseTransition', [
      state('initial', style({
        opacity: 1,
      })),
      transition('initial => fadeOut', [
        animate('0.3s cubic-bezier(0.445, 0.05, 0.55, 0.95)', style({
          opacity: 0, transform: 'translateY(-15px)'
        }))
      ]),
      transition('fadeOut => initial, void => initial', [
        style({
          opacity: 0, transform: 'translateY(15px)'
        }),
        group([
          animate('0.6s cubic-bezier(0.445, 0.05, 0.55, 0.95)', style({
            opacity: 1, transform: 'none'
          })),
          query('@chip', [
            stagger(100, [
              animateChild()
            ])
          ], {optional: true})
        ])
      ])
    ]),
    trigger('chip', [
      transition('fadeOut => initial, void => initial', [
        style({
          opacity: 0, transform: 'translateX(5px)'
        }),
        animate('0.6s ease-out', style({
          opacity: 1, transform: 'none'
        }))
      ])
    ])
  ]
})

export class CarouselComponent implements OnInit {

  isFirstTime = true;

  responseState = 'initial';

  _convoResponse: ConvoResponse;

  _nextResponse: ConvoResponse;

  get convoResponse(): ConvoResponse {
    return this._convoResponse;
  }

  @Input()
  set convoResponse(value: ConvoResponse) {
    if (!value) {
      this._convoResponse = value;
      return;
    }

    if (this.isFirstTime) {
      this.isFirstTime = false;
      this._convoResponse = value;
      return;
    }

    this.responseState = 'fadeOut';
    this._nextResponse = value;
  }

  constructor() { }

  ngOnInit() {
  }

  handleResponseTransition({ fromState, toState }) {
    const stateTransition = `${fromState} => ${toState}`;

    if (stateTransition === 'initial => fadeOut') {
      this._convoResponse = this._nextResponse;
      this.responseState = 'initial';
    }
  }
}
