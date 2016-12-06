import { Component } from '@angular/core';
import {
  NavController, ToastController, AlertController, ModalController, Platform,
  MenuController
} from 'ionic-angular';
import {AuthenticationService} from "../../providers/authentication-service";
import {UserAccountService} from "../../providers/user-account-service";
//import {spotifyAuthConfig} from "../../interfaces/interfaces";
import {Observable} from "rxjs";
import {SpotifyService} from "../../providers/spotify-service";

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
    public menu: MenuController,
    public toastController: ToastController,
    public alertCtrl: AlertController,
    public modalController: ModalController,
    private platform: Platform,
    public spotifyService: SpotifyService
  ) {}

  ionViewDidLoad() {
    this.menu.enable(false);
  }

  ionViewDidLeave() {
    this.menu.enable(true);
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

  changeEmail(){

    let prompt = this.alertCtrl.create({
      title: 'Change your email',
      //message: "Enter your email for a password recovery link.",
      inputs: [
        {
          name: 'password',
          placeholder: 'Password',
          type: 'password'
        },
        {
          name: 'newEmail',
          placeholder: 'New email',
          type: 'email'
        }
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Change',
          handler: data => {
            console.log('Change clicked: ' + data);
            console.log(data.newEmail);

            this.authenticationService.reAuthenticateUser(data.password, ()=>{
              this.authenticationService.updateUserEmail(data.newEmail, () => {
                // success
                let toast = this.toastController.create({
                  message: 'Email changed successfully',
                  duration: 3000,
                  position: 'bottom'
                });
                toast.present();
              });
            });


          }
        }
      ]
    });
    prompt.present();

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

  loginToSpotify() {
    // redirect to spotify login
    window.location.href = this.spotifyService.generateAuthenticationHref();
  }



  private spotifyLogin(href: string): Observable<any> {
    return new Observable(observer => {
console.log(window.cordova.InAppBrowser);
      // Cordova's inappbrowser plugin version
      let browserRef = window.cordova.InAppBrowser.open(href, "_blank", "location=no");
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
            alert("Toimii Suomessa!");
            observer.next(response);
            //this.loginTest = response['access_token'];
          } else {
            alert("fuuuuck...");
            Observable.throw("Something went wrong during authentication");
            alert("Ei toimi Suomessa!");
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


  changeProfileImage(event){

    let image = event.srcElement.files[0];

    let loadingToast = this.toastController.create({
      message: "Uploading..."
    });
    loadingToast.present();



    this.userAccountService.saveImage(image, ()=> {
      // state change events here
      console.log("uploading");
    }, ()=>{
      // error
      loadingToast.dismiss();

      let toast = this.toastController.create({
        message: 'Upload failed',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    }, snapshot => {
      // success
      console.log(snapshot);
      let url = snapshot.downloadURL;

      this.authenticationService.updateUserImageUrl(url, () => {
        console.log("update successful");
        this.userAccountService.getCurrentUser().setImage(url);
      }, () => {
        console.log("update failed");
      });

      loadingToast.dismiss();

      let toast = this.toastController.create({
        message: 'Uploaded an image successfully',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
      //this.navCtrl.pop();
    });

  }

  selectProfileImage(){
    let selectField = document.getElementById("userImageField");
    selectField.click();
  }

}
