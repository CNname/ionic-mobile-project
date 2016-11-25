import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
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

  constructor(public http: Http) {
    SC.initialize({
      client_id:  this.clientId,
      //redirect_uri:  this.redirect_uri
    });
   }

   setPlayingItems(item: Playlist){
     this.playingItems = item;
   }

   startStreaming(id: string){
    SC.stream('/tracks/'+id).then(player => {
      this.SCPlayer = player;

      this.SCPlayer.play();

      this.SCPlayer.on('buffering_start', () => { console.log('buffering...'); });

      this.SCPlayer.on('buffering_end', () => { console.log('music'); });
    });
  }

  pauseStream(){
    this.SCPlayer.pause();
  }

  resumeStream(){
    this.SCPlayer.play();
  }

  searchForItem(query: string): any {
    return SC.get('tracks', {  q: query, limit: 50 });
  }

// id = 42090076
  getPlaylists(): any{
    return SC.get('playlists', { user_id: 42090076 });
  }

  getPlaylistById(id: string): any{
    return true;
  }

  //this doesnt work atm neither does SC.get('charts', { kind: 'top', genre: 'soundcloud:genres:all-music, limit: 30' })
  getCharts(type: string, genre: string ): Observable<any> {
    return this.http.get('http://api.soundcloud.com/resolve?url=https://soundcloud.com/charts/top&client_id=d51aa162fb2f62d2072b34da795b83a4', {})
    .map(res =>{
      console.log(res);
      return res.json()
      //https://api-v2.soundcloud.com/charts?kind=top&genre=soundcloud%3Agenres%3Acountry&client_id=d51aa162fb2f62d2072b34da795b83a4
    });
  }

}
