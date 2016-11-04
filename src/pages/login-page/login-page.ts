import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the LoginPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login-page',
  templateUrl: 'login-page.html'
})
export class LoginPage {

  protected loginEmail: string;
  protected loginPassword: string;
  protected registerPassword: string;
  protected registerPasswordAgain: string;
  loginNav = "login";

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {

  }

  private getLoginEmail(): string {
    return this.loginEmail;
  }

  private getLoginPassword(): string {
    return this.loginPassword;
  }

  logIn() {
      console.log(this.getLoginEmail());
  }

}
