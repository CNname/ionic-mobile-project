import { Injectable, ApplicationRef } from '@angular/core';
import { Http, Jsonp, Response, RequestOptions, Headers, Request, RequestMethod } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { Playlist } from '../classes/Playlist.Class'

declare var SC;

@Injectable()
export class SoundcloudService {

  private clientId: string = 'd51aa162fb2f62d2072b34da795b83a4';
  private redirect_uri: string = 'http://localhost/soundcloud-callback';
  SCPlayer: any;
  playingItems: Playlist;
  play:boolean = false;
  time: number = 0;
  timer: string = '00:00';
  numbers: any;
  minute:number = 0;

  constructor(public http: Http, private jsonp: Jsonp, private applicationRef: ApplicationRef) {
    SC.initialize({
      client_id:  this.clientId,
      //redirect_uri:  this.redirect_uri
    });
   }

   setPlayingItems(item: Playlist){
     this.playingItems = item;
   }

   showTime(x:number){
     let time = Math.floor(x /1000);
     console.log(time);
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

      this.SCPlayer.play();
      this.timer = '00:00';
      this.minute = 0;

      this.SCPlayer.on('buffering_start', () => { console.log('buffering...'); });

      this.SCPlayer.on('buffering_end', () => {
        this.play = true;
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
  }

  resumeStream(){
    this.SCPlayer.play();
  }

  getTrackById(song_id: string, user_id: string): any{
    return SC.get('tracks', {
      id: song_id,
      user_id: user_id
    });
  }

  searchForItem(query: string): any {
    return SC.get('tracks', {
      q: query,
      limit: 40,
      linked_partitioning: 1 }
    );
  }
  getMore(query: string):any{
    return this.http.get(query).map(res => {
      return res.json();
    });
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
    return this.http.get('https://api-v2.soundcloud.com/charts?kind=' + type + '&client_id=d51aa162fb2f62d2072b34da795b83a4', {
        headers: header })
      .map((res: Response) => res.json());
  }

//  *://*/*
}
