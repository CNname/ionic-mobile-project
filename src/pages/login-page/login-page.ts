import { Component } from '@angular/core';
import {NavController, AlertController, ToastController} from 'ionic-angular';
import {AuthenticationService} from "../../providers/authentication-service";
import {Library} from "../library/library";

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

  protected loginEmail: string = "";
  protected loginPassword: string = "";
  protected registerEmail: string = "";
  protected registerPassword: string = "";
  protected registerPasswordAgain: string = "";
  loginNav = "login";
  loginError: string = "";
  registerError: string = "";

  constructor(
    public navCtrl: NavController,
    private authenticationService: AuthenticationService,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController) {
  }

  ionViewDidLoad() {

  }

  private getLoginEmail(): string {
    return this.loginEmail;
  }

  private getLoginPassword(): string {
    return this.loginPassword;
  }

  logIn() {
    if (this.loginEmail.length > 0 &&
        this.loginPassword.length > 0) {
      // register user if passwords match
      this.loginError = "";
      this.authenticationService.logIn(this.loginEmail, this.loginPassword, user => {
        if (user) {
          console.log(user);
          // User is signed in.
          this.navCtrl.push(Library).catch(()=> console.log('push failed'));
        } else {
          // No user is signed in.
          this.navCtrl.popToRoot().catch(()=> console.log('pop to root failed'));
        }
      });
    } else {
      this.loginError = "Please fill all fields.";
    }
  }

  signUp() {
    if (this.registerEmail.length > 0 &&
        this.registerPassword.length > 0 &&
        this.registerPasswordAgain.length > 0) {
      // register user if passwords match
      if (this.registerPassword === this.registerPasswordAgain) {
        this.registerError = "";
        this.authenticationService.signUp(this.registerEmail, this.registerPassword, user => {
          if (user) {
            console.log(user);
            // User is signed in.
            this.navCtrl.push(Library).catch(()=> console.log('push failed'));
          } else {
            // No user is signed in.
            this.navCtrl.popToRoot().catch(()=> console.log('pop to root failed'));
          }
        });
      } else {
        this.registerError = "Passwords doesn't match.";
      }
    } else {
      this.registerError = "Please fill all fields.";
    }
  }

  forgotPassword() {
    let prompt = this.alertCtrl.create({
      title: 'Forgot your password?',
      message: "Enter your email for a password recovery link.",
      inputs: [
        {
          name: 'email',
          placeholder: 'Your email',
          //required: '',
          type: 'email'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Send',
          handler: data => {
            console.log('Send clicked: ' + data);
            console.log(data.email);
            this.authenticationService.sendForgotPasswordEmail(data.email, () => {
              // success
              let toast = this.toastCtrl.create({
                message: 'Link sent successfully',
                duration: 3000,
                position: 'bottom'
              });
              toast.present();
            }, () => {
              // failed
              let toast = this.toastCtrl.create({
                message: 'Sending a link failed',
                duration: 3000,
                position: 'bottom'
              });
              toast.present();
            });
          }
        }
      ]
    });
    prompt.present();

  }

}
