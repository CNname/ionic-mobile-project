import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav } from 'ionic-angular';

import { StatusBar } from 'ionic-native';

import { Library } from '../pages/library/library';
import {LoginPage} from "../pages/login-page/login-page";
import {AuthenticationService} from "../providers/authentication-service";



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make PlayerPage the root (or first) page
  rootPage: any = LoginPage;
  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    private authenticationService: AuthenticationService
  ) {
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Library', component: Library }
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
    this.nav.setRoot(page.component);
  }

  logOut() {
    this.authenticationService.logOut(()=>{
      console.log("logout successful");
    },()=>{
      console.log("logout failed");
    });
  }



}
