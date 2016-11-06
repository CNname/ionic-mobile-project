import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {AuthenticationService} from "./authentication-service";

/*
  Generated class for the UserAccountService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

declare var firebase: any;

@Injectable()
export class UserAccountService {

  constructor(
    public http: Http,
    private authenticationService: AuthenticationService
  ) {
    console.log('Hello UserAccountService Provider');
  }

  saveImage(image: any, stateChange: Function, error: Function, success: Function) {
    let storageRef = firebase.storage().ref();
    // use the Blob or File API for an image

    // first check is there already an image uploaded by user
    // delete if there is, then create a reference of a new image and upload to it
    let imageRef = storageRef.child("test.txt");
    let uploadTask = imageRef.putString("test message");
    uploadTask.on('state_changed', stateChange, error, success);
  }

}
