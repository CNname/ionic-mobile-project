import { Component, ViewChild } from '@angular/core';
import {Platform, MenuController, Nav, NavParams} from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { SpotifyLibrary } from '../pages/spotify-library/spotify-library';
import { SoundcloudLibrary } from '../pages/soundcloud-library/soundcloud-library';
import { AuthenticationService } from "../providers/authentication-service";
import { Settings } from '../pages/settings/settings';
import {UserAccountService} from "../providers/user-account-service";
import {LoadingPage} from "../pages/loading-page/loading-page";
import {Router} from "@angular/router";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make PlayerPage the root (or first) page
  rootPage: any = LoadingPage;
  pages: Array<{title: string, component: any, icon: string}>;

  constructor(
    private platform: Platform,
    public menu: MenuController,
    public authenticationService: AuthenticationService,
    public userAccountService: UserAccountService
  ) {
    this.initializeApp();

    // set our app's pages
    this.pages = [

      { title: ' Spotify Library', component: SpotifyLibrary, icon: "mic"},
      { title: 'Soundcloud Library', component: SoundcloudLibrary, icon: "cloud"},
      { title: 'Settings', component: Settings, icon: "settings" }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    if (page.title === "Settings") this.nav.push(page.component);
    else this.nav.setRoot(page.component);
  }

  logOut() {
    this.menu.close();
    this.authenticationService.logOut(()=>{
      console.log("logout successful");
      this.menu.close().then(()=>{
        this.menu.enable(false);
        //this.nav.setRoot(LoadingPage);
        //this.nav.popToRoot().catch(()=> console.log('pop to root failed'));
      });


    },()=>{
      console.log("logout failed");
    });
  }



}
