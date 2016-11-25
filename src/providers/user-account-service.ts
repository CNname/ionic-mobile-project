import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {AuthenticationService} from "./authentication-service";
import {User} from "../classes/User.class";
import {firebaseUser} from "../interfaces/interfaces";

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

}
