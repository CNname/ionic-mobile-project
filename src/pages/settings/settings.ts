import { Component } from '@angular/core';
import {NavController, ToastController, AlertController, ModalController, Platform} from 'ionic-angular';
import {AuthenticationService} from "../../providers/authentication-service";
import {UserAccountService} from "../../providers/user-account-service";
import {ImageSelectionModalPage} from "../image-selection-modal-page/image-selection-modal-page";
import {spotifyAuthConfig} from "../../interfaces/interfaces";
import {Observable} from "rxjs";

// for cordova inappbrowser-plugin
declare var window: any;

/*
  Generated class for the Settings page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class Settings {

  oldPassword: string = "";
  newPassword: string = "";
  newPasswordAgain: string = "";
  passwordError: string = "";

  loginTest: any;


  constructor(
    public authenticationService: AuthenticationService,
    public userAccountService: UserAccountService,
    public navCtrl: NavController,
    public toastController: ToastController,
    public alertCtrl: AlertController,
    public modalController: ModalController,
    private platform: Platform
  ) {}

  ionViewDidLoad() {
    console.log('Hello Settings Page');
  }

  changePassword() {

    if (
      this.oldPassword.length > 0 &&
      this.newPassword.length > 0 &&
      this.newPasswordAgain.length > 0 &&
      this.newPassword === this.newPasswordAgain
    ) {
      this.passwordError = "";

      this.authenticationService.reAuthenticateUser(this.oldPassword, () => {
        this.authenticationService.updateUserPassword(this.newPassword, ()=> {
          let toast = this.toastController.create({
            message: "Password changed successfully",
            duration: 3000,
            position: "bottom"
          });
          toast.present();
        });
      });

    } else {
      this.passwordError = "Make sure to fill all fields correctly";
    }

  }

  deleteUser(){
    let alert = this.alertCtrl.create({
      title: 'Delete user?',
      message: 'Are you really sure? If you delete your profile, it\'s gone forever.',
      inputs: [
        {
          name: "password",
          placeholder: "Password",
          type: "password"
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Delete',
          handler: data => {
            this.authenticationService.reAuthenticateUser(data.password, ()=>{
              this.authenticationService.deleteUser(() => {
                // success
                this.navCtrl.popToRoot();
              },() => {
                // error
              });
            });

          }
        }
      ]
    });
    alert.present();
  }

  openProfileImageModal(){
    let imageModal = this.modalController.create(ImageSelectionModalPage);
    imageModal.present();
  }

  loginToSpotify() {

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
      redirectUri: encodeURIComponent("http://localhost/callback"),
      scope: "user-read-private",
      state: state
    };

    let authref = authConfig.base +
                  "?client_id=" + authConfig.clientId +
                  "&response_type=" + authConfig.responseType +
                  "&redirect_uri=" + authConfig.redirectUri +
                  "&scope=" + authConfig.scope +
                  "&state=" + authConfig.state;

    this.platform.ready().then(() => {
      this.spotifyLogin(authref).subscribe(res => {
        this.loginTest = res.accessToken;
        this.navCtrl.pop();
      });
    });

  }

  private generateNonce(length: number){

    let text: string = "";
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; // possible characters

    for (let i=0;i<length;i++) {
      text += chars.charAt(~~(Math.random()*chars.length));
    }

    return text;

  }

  private spotifyLogin(href: string): Observable<any> {
    return new Observable(observer => {

      // Cordova's inappbrowser plugin version
      let browserRef = window.cordova.inAppBrowser.open(href, "_blank", "location=no");
      browserRef.addEventListener("loadstart", event => {

        if ((event.url).indexOf("http://localhost/callback") === 0) {
          browserRef.removeEventListener("exit", event => {});
          browserRef.close();
          let response = this.splitParamsToObject(event.url);

          // check if needed parameters are in response
          if (
            response["access_token"] !== null && response["access_token"] !== undefined &&
            response["token_type"] !== null && response["token_type"] !== undefined &&
            response["expires_in"] !== null && response["expires_in"] !== undefined &&
            response["state"] !== null && response["state"] !== undefined
          ) {
            //observer.next(response);
            this.loginTest = response['access_token'];
          } else {
            Observable.throw("Something went wrong during authentication");
          }

        }

      });
      browserRef.addEventListener("exit", event => {
        Observable.throw("Authentication was cancelled");
      });

      // own workaround

     /* window.onload = () => {

        if (window.location.href.search("#") !== -1) window.location.href = window.location.href.replace(/#/i, "?");


        if (window.location.href.indexOf("http://localhost:8100") === 0) {

          //window.location.port = ionicPort;
          console.log("moi");

          let response = this.splitParamsToObject(window.location.href);
          window.onload = null; // reset onload function

          // check if needed parameters are in response
          if (
            response["access_token"] !== null && response["access_token"] !== undefined &&
            response["token_type"] !== null && response["token_type"] !== undefined &&
            response["expires_in"] !== null && response["expires_in"] !== undefined &&
            response["state"] !== null && response["state"] !== undefined
          ) {

            window.localStorage.setItem("access_token", response["access_token"]);
            window.localStorage.setItem("token_type", response["token_type"]);
            window.localStorage.setItem("expires_in", response["expires_in"]);
            window.localStorage.setItem("state", response["state"]);

            observer.next(response);
          } else {
            Observable.throw("Something went wrong during authentication");
          }

        }
      };

      window.location.href = href;*/

    });

  }

  splitParamsToObject(url: string): Object {

    let params = {};
    let splitParams = url.substr(url.indexOf("#")+1).split("&"); // spotify separates parameters with hash

    for (let i=0; i < splitParams.length; i++) {
      params[splitParams[i].split("=")[0]] = splitParams[i].split("=")[1];
    }

    console.log(params);
    return params;
  }

  loginToSoundcloud(){


  }

}
