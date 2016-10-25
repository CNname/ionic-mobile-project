import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { Song } from '../classes/Song.class';

@Injectable()
export class MusicService {
  audioObject: any;
  song: Song;
  public isPlaying = false;

  constructor() { }

  setAudio(url: string){
    this.audioObject = new Audio(url);
  }
  getPlayingAudio(){
    return this.audioObject;
  }
  startPlayback(){
    this.audioObject.play();
    this.isPlaying = true;
    /*this.audioObject.addEventListener('ended', function () {
                      this.pausePlayback();
                });*/
  }
  pausePlayback(){
    this.audioObject.pause();
    this.isPlaying = false;
  }
  getStatus(){
    return this.isPlaying;
  }
  resetAudio(){
    this.audioObject = null;
  }
}
// https://blog.budacode.com/2016/06/02/angular-2-services/
// http://www.joshmorony.com/streaming-music-from-soundcloud-in-ionic-2-part-1/
