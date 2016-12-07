import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import {Observable, Subject} from 'rxjs/Rx';
import {ICallHandler, spotifyAuthConfig} from "../interfaces/interfaces";
import {UserAccountService} from "./user-account-service";
import {AlertController, ToastController} from "ionic-angular";
import {Handling} from "../namespaces/handling";
import {Playlist} from "../classes/Playlist.Class";

@Injectable()
export class SpotifyService implements ICallHandler {

  // provides an event which components can listen
  changeEventSource: Subject<string> = new Subject<string>();
  // observable streams
  changeEvent$ = this.changeEventSource.asObservable();

  constructor(public http: Http, public userAccountService: UserAccountService, public alertCtrl: AlertController, public toastController: ToastController) { }

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
      scope: "user-read-private playlist-modify-public",
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

  addToPlaylist(songId: string, songName: string){

    let radioButtons: Array<Object> = [];

    this.getCurrentUsersPlaylists().subscribe((res)=>{

      let playlists: Array<Playlist> = Handling.HandleJson.SpotifyPlaylists(res['items']);
      console.log(playlists);

      radioButtons.push({
        type: 'radio',
        value: "totallySoNewStreamgullPlaylist",
        label: "Create new playlist",
        checked: true
      });

      for (let i=0; i<playlists.length; i++) {
        let btn = {
          type: 'radio',
          value: playlists[i].getId(),
          label: playlists[i].getName()
        };
        radioButtons.push(btn);
      }

      let alert = this.alertCtrl.create({
        title: 'Add to playlist',
        message: songName,
        inputs: radioButtons,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {}
          },
          {
            text: 'Add',
            handler: data => {

              if (data === "totallySoNewStreamgullPlaylist") {
                let newPlaylistAlert = this.alertCtrl.create({
                  title: 'Create a new playlist',
                  inputs: [{
                    name: "newPlaylist",
                    placeholder: "Name",
                    type: "text"
                  }],
                  buttons: [
                    {
                      text: 'Cancel',
                      role: 'cancel',
                      handler: () => {}
                    },
                    {
                      text: 'Create',
                      handler: data => {
                        this.createNewPlaylist(data.newPlaylist).subscribe(res => {
                          let newPlaylistId = res['id'];
                          this.addSongToPlaylistWithToasts(songId, newPlaylistId);
                        }, err => {
                          let toast = this.toastController.create({
                            message: 'Crating a new playlist failed',
                            duration: 3000,
                            position: 'bottom'
                          });
                          toast.present();
                        });
                      }
                    }
                  ]
                });
                newPlaylistAlert.present();

              } else {
                this.addSongToPlaylistWithToasts(songId, data);
              }

            }
          }
        ]
      });
      alert.present();

    });
  }

  private addSongToPlaylistWithToasts(songId: string, playlistId: string) {
    this.addSongToPlaylist(songId, playlistId).subscribe(res => {
      let toast = this.toastController.create({
        message: 'Song added to playlist successfully',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    }, err => {
      let toast = this.toastController.create({
        message: 'Adding a song to playlist failed',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
      this.changeEventSource.next("moi");
    });
  }

  addSongToPlaylist(songId: string, playlistId: string): Observable<any>{


    let spotifyparams = this.userAccountService.getSpotifyParams();
    let spotifyUser = this.userAccountService.getSpotifyUser();
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + spotifyparams['accessToken']
    });
    let options = new RequestOptions({ headers: headers });

    // a post call body parameters
    let body = {
      "uris": ["spotify:track:" + songId]
    };

    return this.http.post('https://api.spotify.com/v1/users/' + spotifyUser['id'] + '/playlists/' + playlistId + '/tracks', body, options)
      .map((res: Response) => res.json())
      .catch(this.spotifyErrorCatch);
  }

  removeFromAPlaylist(songId: string,  playlistId: string): Observable<any> {
    let spotifyparams = this.userAccountService.getSpotifyParams();
    let spotifyUser = this.userAccountService.getSpotifyUser();
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + spotifyparams['accessToken']
    });
    let tracks = { tracks: [{ "uri": "spotify:track:" + songId}] };
    let options = new RequestOptions({ headers: headers, body: tracks });

    return this.http.delete('https://api.spotify.com/v1/users/' + spotifyUser['id'] + '/playlists/' + playlistId + '/tracks', options)
      .map((res: Response) => res.json())
      .catch(this.spotifyErrorCatch);
  }

  removeFromAPlaylistWithToasts(songId: string,  playlistId: string) {
    this.removeFromAPlaylist(songId, playlistId).subscribe(res => {
      let toast = this.toastController.create({
        message: 'Song removed from a playlist successfully',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    }, err => {
      let toast = this.toastController.create({
        message: 'Removing a song failed',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
      this.changeEventSource.next("moi");
    });
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

  /**
   *
   * @param name
   * @param publicPlaylist needs playlist-modify-private scope.
   * @param collaborative needs playlist-modify-private and playlist-modify-public scopes.
   * @returns {Observable<R>}
   */
  createNewPlaylist(name: string, publicPlaylist: boolean = true, collaborative: boolean = false): Observable<any> {


    let spotifyparams = this.userAccountService.getSpotifyParams();
    let spotifyUser = this.userAccountService.getSpotifyUser();
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + spotifyparams['accessToken']
    });
    let options = new RequestOptions({ headers: headers });

    // a post call body parameters
    let body = {
      "name": name,
      "public": publicPlaylist,
      "collaborative": collaborative
    };

    return this.http.post('https://api.spotify.com/v1/users/' + spotifyUser['id'] + '/playlists' , body, options)
      .map((res: Response) => res.json())
      .catch((err: any) => Observable.throw(err.json().error || 'Server error'));

  }

  spotifyErrorCatch(err: Response | any): Observable<any>  {
    return Observable.throw(err.json().error || err.toString() || 'Server error');
  }

}
