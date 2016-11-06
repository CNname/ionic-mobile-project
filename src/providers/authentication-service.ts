import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {Library} from "../pages/library/library";
import {NavController} from "ionic-angular";
import {LoginPage} from "../pages/login-page/login-page";


/*
  Generated class for the AuthenticationService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

declare var firebase: any;

@Injectable()
export class AuthenticationService {

  private config: Object = {
    apiKey: "AIzaSyCKsY6TRS3LwLLXAReb0Umlq6QUBFqsXEg",
    authDomain: "streamgull.firebaseapp.com",
    databaseURL: "https://streamgull.firebaseio.com",
    storageBucket: "streamgull.appspot.com",
    messagingSenderId: "977961258413"
  };

  constructor(public http: Http/*, public navCtrl: NavController*/) {
    console.log('Hello AuthenticationService Provider');
    this.firebaseInit();

  }

  private firebaseInit() {
    // Initialize Firebase
    firebase.initializeApp(this.config);
  }

  signUp(username: string, passwd: string, callback: Function, fail: Function) {
    firebase.auth().createUserWithEmailAndPassword(username, passwd).then(callback).catch(fail);
  }

  logIn(username: string, passwd: string, callback: Function, fail: Function) {
    firebase.auth().signInWithEmailAndPassword(username, passwd).then(callback).catch(fail);
  }

  logOut(success: Function, fail: Function) {
    firebase.auth().signOut().then(success).catch(fail);
  }

  authStateChange(callback: Function) {
    firebase.auth().onAuthStateChanged(callback);
  }

  /**
   *
   * @param email
   * @param callback
   * @param fail
   */
  sendForgotPasswordEmail(email: string, callback: Function, fail: Function) {
    firebase.auth().sendPasswordResetEmail(email).then(callback).catch(fail);
  }

  updateUserPassword(newPassword: string, callback: Function, fail: Function) {
    let user = firebase.auth().currentUser;
    user.updatePassword(newPassword).then(callback).catch(fail);
  }

  updateUserEmail(newEmail: string, callback: Function, fail: Function) {
    let user = firebase.auth().currentUser;
    user.updateEmail(newEmail).then(callback).catch(fail);
  }

  updateUserImageUrl(url: string, callback: Function, fail: Function) {
    let user = firebase.auth().currentUser;
    user.updateProfile({
      photoUrl: url
    }).then(callback).catch(fail);
  }

  // possibly not needed
  getUserProfile(){
    let user = firebase.auth().currentUser;
    if (user != null) {
      // ...
    }
  }

  deleteUser(callback: Function, fail: Function) {
    let user = firebase.auth().currentUser;
    user.delete().then(callback).catch(fail);
  }

  reAuthenticateUser(callback: Function, fail: Function) {
    let user = firebase.auth().currentUser;
    let credential;
    user.reauthenticate(credential).then(callback).catch(fail);
  }

  isUserLoggedIn(): boolean {
    let user = firebase.auth().currentUser;
    return user != null;
  }

}
