import { Injectable, ApplicationRef } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Playlist } from '../classes/Playlist.Class'

//import * as SC from 'soundcloud';

declare var SC;

@Injectable()
export class SoundcloudService {

  private clientId: string = 'wdwbHQY11PLXg8twL0AtVBmGJTwuvFzD';
  private redirect_uri: string = 'http://localhost/soundcloud-callback';
  SCPlayer: any;
  playingItems: Playlist;
  time: number = 0;
  timer: string = '00:00';
  numbers: any;
  minute:number = 0;
  play: boolean = false;
  playing: boolean = false;

  constructor(public http: Http, private applicationRef: ApplicationRef) {
    SC.initialize({
      client_id:  this.clientId,
      redirect_uri:  this.redirect_uri
    });
   }

   login(){
     SC.connect().then(function() {
       return SC.get('/me'); }).then(function(me) {
       console.log('Hello, ' + me.username);
     });
   }

   setPlayingItems(item: Playlist){
     this.playingItems = item;
   }


   showTime(x:number){
     let time = Math.floor(x /1000);
     //console.log(time);
     if((( (time)-(this.minute*60) ) / 60) == 1){
       console.log('minute added');
       this.minute += 1;
     }

     if(this.minute < 1){
       if(time < 10){
           this.timer = '00:0'+time;
       }else{
         this.timer = '00:'+time;
       }

     }else if(this.minute >= 1 && this.minute < 10){
       if((time - (this.minute*60)) < 10){
         this.timer = '0'+this.minute+':0'+(time-(this.minute*60));
       }else if(((this.time) - (this.minute*60)) < 60){
         this.timer = '0'+this.minute+':'+(time-(this.minute*60));
       }

     }else if(this.minute >= 10){
       if((time - (this.minute*60)) < 10) {
         this.timer = this.minute+':0'+(time-(this.minute*60));
       }else if(((time) - (this.minute*60)) < 60) {
         this.timer = this.minute+':'+(time-(this.minute*60));
       }
     }
     this.applicationRef.tick();
   }

   startStreaming(id: string){
    SC.stream('/tracks/'+id).then(player => {
      this.SCPlayer = player;
      this.play = true;
      this.playing = true;

      this.SCPlayer.play();
      this.timer = '00:00';
      this.minute = 0;

      this.SCPlayer.on('buffering_start', () => { console.log('buffering...'); });

      this.SCPlayer.on('buffering_end', () => {
        console.log('music');
      });
      this.SCPlayer.on('time', ()=>{
          this.showTime(this.SCPlayer.currentTime());
      })
    });
  }

  currentTime():string{
  /*  if(this.SCPlayer){
      return this.SCPlayer.on('time', () => {
        return this.SCPlayer.currentTime();
      });
    }*/
    //return Math.floor(this.time /1000);
    return this.timer;
  }

  pauseStream(){
    this.SCPlayer.pause();
    this.playing = false;
  }

  resumeStream(){
    this.SCPlayer.play();
    this.playing = true;
  }


  getTrackById(song_id: string, user_id: string): any{
    return SC.get('tracks', {
      id: song_id,
      user_id: user_id
    });
  }

  getStatus(){
    return this.play;
  }

  isPlaying(): boolean {
    return this.playing;
  }

  searchForItem(query: string): any {
    return SC.get('tracks', {
      q: query,
      limit: 40,
      linked_partitioning: 1 }
    );
  }
  getMore(query: string):any{
    let header = new Headers();
    header.append("Accept", "*/*");
    header.append("Content-Type", 'application/json');
    return this.http.get(query, {
        headers: header })
      .map((res: Response) => res.json()).catch(this.ErrorCatch);
  }

  // id = 42090076
  getPlaylists(): any{
    return SC.get('playlists', { user_id: 42090076 });
  }

  getPlaylistById(id: string): any{
    return true;
  }

  //this doesnt work atm neither does SC.get('charts', { kind: 'top', genre: 'soundcloud:genres:all-music, limit: 30' })
  getCharts(type: string, genre: string ): any {

    let header = new Headers();
    header.append("Accept", "*/*");
    header.append("Content-Type", 'application/json');
    return this.http.get('https://api-v2.soundcloud.com/charts?kind=' + type + '&genre='+ genre +'&client_id=wdwbHQY11PLXg8twL0AtVBmGJTwuvFzD', {
        headers: header })
      .map((res: Response) => res.json()).catch(this.ErrorCatch);
  }

  ErrorCatch(err: Response | any): Observable<any>  {
    return Observable.throw(err.json().error || err.toString() || 'Server error');
  }
}
