import {Component, OnInit, OnDestroy} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AuthenticationService} from "../../providers/authentication-service";
import {UserAccountService} from "../../providers/user-account-service";
import {LoginPage} from "../login-page/login-page";
import {SpotifyLibrary} from "../spotify-library/spotify-library";
import {SoundcloudLibrary} from "../soundcloud-library/soundcloud-library";
import {Subscription} from "rxjs";
import {URLSearchParams} from "@angular/http";

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

  constructor(
    public navCtrl: NavController,
    public authenticationService: AuthenticationService,
    public userAccountService: UserAccountService,
    private params: NavParams
  ) {
    console.log(params.get("access_token"));
  }

  ngOnInit(): void {
    let param = new URLSearchParams(window.location.search);
    console.log("test: " + param.get('test'));
    console.log(param.rawParams);
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

        if (lib === "spotify") this.navCtrl.push(SpotifyLibrary).catch(()=> console.log('push failed'));
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
