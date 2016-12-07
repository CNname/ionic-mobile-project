import {Component, OnInit} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AuthenticationService} from "../../providers/authentication-service";
import {UserAccountService} from "../../providers/user-account-service";
import {LoginPage} from "../login-page/login-page";
import {SpotifyLibrary} from "../spotify-library/spotify-library";
import {SoundcloudLibrary} from "../soundcloud-library/soundcloud-library";

/*
  Generated class for the Loading page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-loading',
  templateUrl: 'loading-page.html'
})
export class LoadingPage implements OnInit {

  private loadingTexts: string[] = [
   '"Straightening feathers"',
   '"Polishing the beak"',
   '"Setting up a nest..."',
   '"Cleaning up some bird poos..."',
   '"It\'s hatching!"'
  ];
  activeLoadingText: string;
  private loggedIntoSpotify: boolean = false;

  constructor(
    public navCtrl: NavController,
    public authenticationService: AuthenticationService,
    public userAccountService: UserAccountService,
  ) {}

  ngOnInit(): void {
    if (window.location.href.indexOf('#') > -1) {

      let param = this.splitParamsToObject(window.location.href);

      let accessToken = param['access_token'];
      let expiresIn = param['expires_in'];
      let state = param['state'];
      let tokenType = param['token_type'];

      if (
       accessToken !== null && accessToken !== undefined &&
       expiresIn !== null && expiresIn !== undefined &&
       state !== null && state !== undefined &&
       tokenType !== null && tokenType !== undefined
       ) {

        let tokenStart = Date.now();

        this.userAccountService.saveUsersSpotifyParams({
          accessToken: accessToken,
          expiresIn: +expiresIn,
          tokenStart: +tokenStart,
          state: state,
          tokenType: tokenType
        });

        this.loggedIntoSpotify = true;

      }

    }
  }



  splitParamsToObject(url: string): Object {

    let params = {};
    let splitParams = url.substr(url.indexOf("#")+1).split("&");

    for (let i=0; i < splitParams.length; i++) {
      params[splitParams[i].split("=")[0]] = splitParams[i].split("=")[1];
    }

    console.log(params);
    return params;
  }

  ionViewDidLoad() {

    console.log('Hello Loading Page');

    this.activeLoadingText = this.getRandomLoadingText();

    this.authenticationService.authStateChange(user => {
      if (user) {
        this.userAccountService.setCurrentUser(
          this.authenticationService.getUserProfile()
        );
        // User is signed in.

        // TODO check if user is signed to spotify and/or soundcloud
        // ...
        let lib = "spotify";

        if (lib === "spotify") this.navCtrl.push(SpotifyLibrary, { loggedIntoSpotify: this.loggedIntoSpotify }).catch(()=> console.log('push failed'));
        else this.navCtrl.push(SoundcloudLibrary).catch(()=> console.log('push failed'));

      } else {
        // No user is signed in.
        this.navCtrl.push(LoginPage).catch(()=> console.log('push failed'));
      }
    });
  }

  getRandomLoadingText(): string {

    let rand: number = Math.random() * (this.loadingTexts.length - 1);
    // check if not integer
    if (rand % 1 !== 0) rand = ~~rand;
    return this.loadingTexts[rand];

  }

}
