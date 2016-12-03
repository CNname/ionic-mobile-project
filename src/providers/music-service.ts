import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {SoundcloudService} from "./soundcloud-service";

@Injectable()
export class MusicService {
  audioObject: any; // audio object for spotify
  isPlaying = false;

  constructor(public soundcloudService: SoundcloudService) { }

  setAudio(url: string){
    this.audioObject = new Audio(url);
  }

  isPlayerInit(): boolean{
    //return typeof this.audioObject !== 'undefined';
    if (this.soundcloudService.getStatus() || typeof this.audioObject !== 'undefined') return true;
    return false;
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
    if (this.soundcloudService.isPlaying() || this.isPlaying) return true;
    else return false;
  }
  resetAudio(){
    this.audioObject.pause();
    this.audioObject = null;
    this.isPlaying = false;
  }




}
// https://blog.budacode.com/2016/06/02/angular-2-services/
// http://www.joshmorony.com/streaming-music-from-soundcloud-in-ionic-2-part-1/
