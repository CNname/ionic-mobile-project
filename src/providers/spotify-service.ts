import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import {ICallHandler, spotifyAuthConfig} from "../interfaces/interfaces";
import {UserAccountService} from "./user-account-service";

@Injectable()
export class SpotifyService implements ICallHandler {

  constructor(public http: Http, public userAccountService: UserAccountService) { }

  generateAuthenticationHref(): string {

    // generate nonce for a state parameter,
    // so you can ensure that request and response belongs to same browser.
    // This protects against cross-site request forgery
    let state = this.generateNonce(32);

    // save state value to localStorage for future api calls
    window.localStorage.setItem("state", state);

    let authConfig: spotifyAuthConfig = {
      base: "https://accounts.spotify.com/authorize",
      clientId: "2f27c1567f8d4774b936b1ae98e91214",
      responseType: "token",
      redirectUri: encodeURIComponent(window.location.protocol + "//" + window.location.host + "?"),
      scope: "user-read-private",
      state: state
    };

    return authConfig.base +
      "?client_id=" + authConfig.clientId +
      "&response_type=" + authConfig.responseType +
      "&redirect_uri=" + authConfig.redirectUri +
      "&scope=" + authConfig.scope +
      "&state=" + authConfig.state;
  }

  private generateNonce(length: number){

    let text: string = "";
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; // possible characters

    for (let i=0;i<length;i++) {
      text += chars.charAt(~~(Math.random()*chars.length));
    }

    return text;

  }

  getPlaylistById(userId: string, playlistId: string): Observable<any> {

    return this.http.get('https://api.spotify.com/v1/users/' + userId + '/playlists/' + playlistId + '/tracks?offset=0&limit=100', {})
      .map(res => res.json())
      .catch(this.spotifyErrorCatch);

  }

  getUserById(id: string): Observable<any> {

    return this.http.get('https://api.spotify.com/v1/users/' + id, {})
      .map(res => res.json())
      .catch(this.spotifyErrorCatch);
  }

  getArtistById(id: string): Observable<any> {

    return this.http.get('https://api.spotify.com/v1/artists/' + id, {})
      .map(res => res.json())
      .catch(this.spotifyErrorCatch);
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
        .catch(this.spotifyErrorCatch);
  }

  searchForItem(query: string, offset:number): Observable<any> {
    return this.http.get('https://api.spotify.com/v1/search?q=' + query + '&type=track,artist&offset=' + offset + '&limit=30', {})
      .map(res => res.json())
      .catch(this.spotifyErrorCatch);
  }

  getMe(): Observable<any> {

    let spotifyparams = this.userAccountService.getSpotifyParams();

    let headers = new Headers({ "Authorization": "Bearer " + spotifyparams['accessToken'] });
    let options = new RequestOptions({ headers: headers });

    return this.http.get('https://api.spotify.com/v1/me', options)
      .map(res => res.json())
      .catch(this.spotifyErrorCatch);
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
      .catch(this.spotifyErrorCatch);
  }

  loadPlaylistById(ownerId: string, playlistId: string): Observable<any> {

    let spotifyparams = this.userAccountService.getSpotifyParams();
    let headers = new Headers({ "Authorization": "Bearer " + spotifyparams['accessToken'] });
    let options = new RequestOptions({ headers: headers });

    return this.http.get('https://api.spotify.com/v1/users/'+ ownerId +'/playlists/' + playlistId, options)
      .map((res: Response) => res.json())
      .catch(this.spotifyErrorCatch);
  }

  getCurrentUsersPlaylists(): Observable<any> {

    let spotifyparams = this.userAccountService.getSpotifyParams();
    let headers = new Headers({ "Authorization": "Bearer " + spotifyparams['accessToken'] });
    let options = new RequestOptions({ headers: headers });

    return this.http.get('https://api.spotify.com/v1/me/playlists', options)
      .map((res: Response) => res.json())
      .catch(this.spotifyErrorCatch);
  }

  spotifyErrorCatch(err: Response | any): Observable<any>  {
    return Observable.throw(err.json().error || err.toString() || 'Server error');
  }

}
