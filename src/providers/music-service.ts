import {Injectable, ChangeDetectorRef} from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { Song } from '../classes/Song.class';

@Injectable()
export class MusicService {
  audioObject: any;
  isPlaying = false;

  constructor() { }

  setAudio(url: string){
    this.audioObject = new Audio(url);
  }

  isPlayerInit(){
    return typeof this.audioObject !== 'undefined';
  }

  startPlayback(){
    this.audioObject.play();
    this.isPlaying = true;
  }
  pausePlayback(){
    this.audioObject.pause();
    this.isPlaying = false;
  }
  getStatus(){
    return this.isPlaying;
  }
  resetAudio(){
    this.audioObject.pause();
    this.audioObject = null;
    this.isPlaying = false;
  }




}
// https://blog.budacode.com/2016/06/02/angular-2-services/
// http://www.joshmorony.com/streaming-music-from-soundcloud-in-ionic-2-part-1/
