import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class SpotifyService {
  playlist = "assets/json/userPlaylist.json";
  playlistcontent = "assets/json/playlist.json";

  constructor(public http: Http) { }

  loadPlaylist(): Observable<SpotifyService[]> {
      return this.http.get(this.playlist)
        .map(res => <SpotifyService[]>res.json());
  }

  loadPlaylistContent(playlist_id: string): Observable<SpotifyService[]> {
      return this.http.get(this.playlistcontent)
        .map(res => <SpotifyService[]>res.json());
  }
  
  getPlaylistById(userId: string, playlistId: string): any {

    return this.http.get('https://api.spotify.com/v1/users/' + userId + '/playlists/' + playlistId + '/tracks?offset=0&limit=100', {})
      .map(res => {

        return res.json()
      })
  }
  
  getUserById(id: string): any {

    return this.http.get('https://api.spotify.com/v1/users/' + id, {})
      .map(res => {
        res.json()
      })
  }

   searchForItem(query: string): any {

    return this.http.get('https://api.spotify.com/v1/search?q=' + query + '&type=track', {})
      .map(res => {
        return res.json()
      })
  }
}
