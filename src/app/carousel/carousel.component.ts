import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
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
import { ImageCapture } from 'image-capture';
import * as firebase from 'firebase';
import { AngularFireStorage } from 'angularfire2/storage';

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
          ], { optional: true })
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

  blankCanvas = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAEYklEQVR4Xu3UAQkAAAwCwdm/9HI83BLIOdw5AgQIRAQWySkmAQIEzmB5AgIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlACBB1YxAJfjJb2jAAAAAElFTkSuQmCC`;
  isFirstTime = true;
  myAngularxQrCode='';
  responseState = 'initial';
  

  @ViewChild('video') video: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;

  imageCapture: any;
  hideVideo = false;


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

    if (this._nextResponse.intent === 'take_picture') {
      this.hideVideo = false;
      console.log('invoke camera');
      this.getCameraDevices();
    }

    if (this._nextResponse.intent === 'cheese') {
      this.getCameraDevices().then(() => this.snapPicture());
    }

    if(this._nextResponse.intent === 'cheese_yes'){
     
      const imageData = this.canvas.nativeElement.toDataURL("image/png");

      if(imageData === this.blankCanvas){
        return;
      }
console.log('imagedata', imageData);
      const filepath = (new Date()).getTime()+"ioxkl_pic.png";
      this.storage.ref(filepath).putString(imageData, firebase.storage.StringFormat.DATA_URL).then((uploadSnapshot)=> {
        console.log('downloadurl',uploadSnapshot.downloadURL);
        this.myAngularxQrCode = uploadSnapshot.downloadURL;
      });


    }

  }

  constructor(private storage: AngularFireStorage) { }

  ngOnInit() {
  }

  handleResponseTransition({ fromState, toState }) {
    const stateTransition = `${fromState} => ${toState}`;

    if (stateTransition === 'initial => fadeOut') {
      this._convoResponse = this._nextResponse;
      this.responseState = 'initial';
    }
  }

  getCameraDevices() {
    return navigator.mediaDevices.getUserMedia({ video: true })
      .then((mediaStream) => {
        this.video.nativeElement.srcObject = mediaStream;
        const track = mediaStream.getVideoTracks()[0];
        this.imageCapture = new ImageCapture(track);

      })
      .catch(error => console.error('getUserMedia() error:', error));
  }

  snapPicture() {
    this.hideVideo = true;
    this.imageCapture.grabFrame()
      .then(imageBitmap => {
        this.canvas.nativeElement.width = imageBitmap.width;
        this.canvas.nativeElement.height = imageBitmap.height+40;
        this.canvas.nativeElement.getContext('2d').fillStyle="#FFFFFF";
        this.canvas.nativeElement.getContext('2d').fillRect(0,0, this.canvas.nativeElement.width , this.canvas.nativeElement.height)
        this.canvas.nativeElement.getContext('2d').drawImage(imageBitmap, 0, 0);
        let img = document.getElementById('logo');
        this.canvas.nativeElement.getContext('2d').drawImage(img, this.canvas.nativeElement.width-210, imageBitmap.height+5);
        this.canvas.nativeElement.getContext('2d').font="12px Roboto";
        
        this.canvas.nativeElement.getContext('2d').fillStyle="#848484";
        this.canvas.nativeElement.getContext('2d').fillText("#ioxkl18  #io18extended", 10,  imageBitmap.height+23);

      })
      .catch(error => console.log(error));
  }

  
}
