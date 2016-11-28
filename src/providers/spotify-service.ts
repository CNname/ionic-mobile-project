import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import {ICallHandler} from "../interfaces/interfaces";

@Injectable()
export class SpotifyService implements ICallHandler {
  playlist = "assets/json/userPlaylist.json";
  playlistcontent = "assets/json/playlist.json";

  constructor(public http: Http) { }

  loadPlaylist(): Observable<SpotifyService[]> {
      return this.http.get(this.playlist)
        .map(res => <SpotifyService[]>res.json());
  }

  loadPlaylistContent(playlist_id: string): Observable<SpotifyService[]> {
      return this.http.get(this.playlistcontent).map(res => <SpotifyService[]>res.json());
  }

  getPlaylistById(userId: string, playlistId: string): Observable<any> {

    return this.http.get('https://api.spotify.com/v1/users/' + userId + '/playlists/' + playlistId + '/tracks?offset=0&limit=100', {})
      .map(res => {
        return res.json()
      })

  }

  getUserById(id: string): Observable<any> {

    return this.http.get('https://api.spotify.com/v1/users/' + id, {})
      .map(res => {
        return res.json()
      })
  }

  getArtistById(id: string): Observable<any> {

    return this.http.get('https://api.spotify.com/v1/artists/' + id, {})
      .map(res => {
        return res.json()
      })
  }

  /**
   *
   * @param id
   * @param country in ISO 3166-1 alpha-2 country code
   * @returns {Observable<any>}
   */
  getPopularSongsByArtist(id: string, country: string = "FI"): Observable<any> {
      return this.http.get('https://api.spotify.com/v1/artists/' + id + '/top-tracks?country=' + country, {})
        .map(res => {
          return res.json()
        })
  }

  searchForItem(query: string, offset:number): Observable<any> {

    return this.http.get('https://api.spotify.com/v1/search?q=' + query + '&type=track,artist&offset=' + offset + '&limit=30', {})
      .map(res => {
        return res.json()
      })

  }

}
