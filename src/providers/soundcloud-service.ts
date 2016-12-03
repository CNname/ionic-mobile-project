import { Injectable } from '@angular/core';
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
  play: boolean = false;
  playing: boolean = false;

  constructor(public http: Http, private jsonp: Jsonp) {
    SC.initialize({
      client_id:  this.clientId,
      //redirect_uri:  this.redirect_uri
    });
   }

   setPlayingItems(item: Playlist){
     this.playingItems = item;
   }

   timer(): Observable<number>{
       let timer = Observable.timer(1000,1000);
       return timer;
   }

   startStreaming(id: string){
    SC.stream('/tracks/'+id).then(player => {
      this.SCPlayer = player;
      this.play = true;
      this.playing = true;

      this.SCPlayer.play();

      this.SCPlayer.on('buffering_start', () => { console.log('buffering...'); });

      this.SCPlayer.on('buffering_end', () => {
        console.log('music');
      });
    });
  }

  pauseStream(){
    this.SCPlayer.pause();
    this.playing = false;
  }

  resumeStream(){
    this.SCPlayer.play();
    this.playing = true;
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
