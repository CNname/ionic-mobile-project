import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {AuthenticationService} from "./authentication-service";
import {User} from "../classes/User.class";
import {firebaseUser, SpotifyParams} from "../interfaces/interfaces";

/*
  Generated class for the UserAccountService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

declare var firebase: any;

@Injectable()
export class UserAccountService {

  private _currentUser: User;

  constructor(
    public http: Http,
    private authenticationService: AuthenticationService
  ) {
    console.log('Hello UserAccountService Provider');
    //this.setCurrentUser();
  }

  setCurrentUser(user: firebaseUser) {
    if (user != null) {
      this._currentUser = new User(user.email);
      if (typeof user.photoURL == "string") {
        this._currentUser.setImage(user.photoURL);
      }
    }
  }

  getCurrentUser(): User {
    return this._currentUser;
  }

  saveImage(image: File, stateChange: Function, error: Function, success: Function) {
    let storageRef = firebase.storage().ref();
    // first check is there already an image uploaded by user
    // delete if there is, then create a reference of a new image and upload to it
    let imageRef = storageRef.child(image.name);
    let uploadTask = imageRef.put(image).then(success).catch(error);
  }

  saveUsersSpotifyParams(params: SpotifyParams){
    // TODO set params after currentuser is logged in to app
    //this._currentUser.setSpotifyParams(params);

    // quick and dirty: save params straight to localstorage from here
    this.setSpotifyParams(params);

  }

  getSpotifyParams(): SpotifyParams {
    //return this._spotifyParams;
    return JSON.parse(window.localStorage.getItem("spotifyparams"));
  }

  setSpotifyParams(value: SpotifyParams) {
    //this._spotifyParams = value;
    window.localStorage.setItem("spotifyparams", JSON.stringify(value));
  }

}
