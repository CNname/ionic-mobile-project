import { Component } from '@angular/core';
import {NavController, ToastController, AlertController, ModalController} from 'ionic-angular';
import {AuthenticationService} from "../../providers/authentication-service";
import {UserAccountService} from "../../providers/user-account-service";
import {ImageSelectionModalPage} from "../image-selection-modal-page/image-selection-modal-page";

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

  constructor(
    private authenticationService: AuthenticationService,
    private userAccountService: UserAccountService,
    public navCtrl: NavController,
    private toastController: ToastController,
    private alertCtrl: AlertController,
    private modalController: ModalController
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

  }

  openProfileImageModal(){
    let imageModal = this.modalController.create(ImageSelectionModalPage);
    imageModal.present();
  }

}
