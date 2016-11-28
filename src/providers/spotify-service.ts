import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import {ICallHandler} from "../interfaces/interfaces";
import {UserAccountService} from "./user-account-service";

@Injectable()
export class SpotifyService implements ICallHandler {

  constructor(public http: Http, public userAccountService: UserAccountService) { }

  getPlaylistById(userId: string, playlistId: string): Observable<any> {

    return this.http.get('https://api.spotify.com/v1/users/' + userId + '/playlists/' + playlistId + '/tracks?offset=0&limit=100', {})
      .map(res => res.json())
      //.catch(this.spotifyErrorCatch);

  }

  getUserById(id: string): Observable<any> {

    return this.http.get('https://api.spotify.com/v1/users/' + id, {})
      .map(res => res.json())
      //.catch(this.spotifyErrorCatch);
  }

  getArtistById(id: string): Observable<any> {

    return this.http.get('https://api.spotify.com/v1/artists/' + id, {})
      .map(res => res.json())
      //.catch(this.spotifyErrorCatch);
  }

  /**
   *
   * @param id
   * @param country in ISO 3166-1 alpha-2 country code
   * @returns {Observable<any>}
   */
  getPopularSongsByArtist(id: string, country: string = "FI"): Observable<any> {
      return this.http.get('https://api.spotify.com/v1/artists/' + id + '/top-tracks?country=' + country, {})
        .map(res => res.json())
        //.catch(this.spotifyErrorCatch);
  }

  searchForItem(query: string, offset:number): Observable<any> {
    return this.http.get('https://api.spotify.com/v1/search?q=' + query + '&type=track,artist&offset=' + offset + '&limit=30', {})
      .map(res => res.json())
      //.catch(this.spotifyErrorCatch);
  }

  getMe(): Observable<any> {

    let spotifyparams = this.userAccountService.getSpotifyParams();

    let headers = new Headers({ "Authorization": "Bearer " + spotifyparams['accessToken'] });
    let options = new RequestOptions({ headers: headers });

    return this.http.get('https://api.spotify.com/v1/me', options)
      .map(res => res.json())
      //.catch(this.spotifyErrorCatch);
  }

  /**
   * @param limit 1-50
   * @param locale desired language
   * @param country in ISO 3166-1 alpha-2 country code
   * @returns {Observable<R>}
   */
  getFeaturedPlaylists(limit: number = 20, locale: string = "en_FI", country: string = "FI"): Observable<any> {

    let spotifyparams = this.userAccountService.getSpotifyParams();
    let headers = new Headers({ "Authorization": "Bearer " + spotifyparams['accessToken'] });
    let options = new RequestOptions({ headers: headers });

    return this.http.get('https://api.spotify.com/v1/browse/featured-playlists?limit=' + limit + '&locale=' + country + '&country=' + country, options)
      .map((res: Response) => res.json())
      //.catch(this.spotifyErrorCatch);
  }

  spotifyErrorCatch(err: any) {
    Observable.throw(err.json().error || 'Server error');
  }

}
