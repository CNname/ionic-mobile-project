import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
//import * as firebase from 'firebase';

/*
  Generated class for the AuthenticationService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

declare var firebase: any;

@Injectable()
export class AuthenticationService {

  config: Object = {
    apiKey: "AIzaSyCKsY6TRS3LwLLXAReb0Umlq6QUBFqsXEg",
    authDomain: "streamgull.firebaseapp.com",
    databaseURL: "https://streamgull.firebaseio.com",
    storageBucket: "",
    messagingSenderId: "977961258413"
  };

  constructor(public http: Http) {
    console.log('Hello AuthenticationService Provider');
    //this.firebase = firebase;
  }

  // firebase initialization needs fixing
  firebaseInit() {
    //console.log(firebase);

  }

}
