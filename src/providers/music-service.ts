import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class MusicService {
  audioObject: any;
  
  constructor() {
      
  }
  startPlayback(){
    //this.audioObject = new Audio(url);
    
  }

}
// https://blog.budacode.com/2016/06/02/angular-2-services/
// http://www.joshmorony.com/streaming-music-from-soundcloud-in-ionic-2-part-1/