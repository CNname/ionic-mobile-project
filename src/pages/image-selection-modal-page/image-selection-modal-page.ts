import { Component } from '@angular/core';
import {NavController, ToastController} from 'ionic-angular';
import {UserAccountService} from "../../providers/user-account-service";
import {AuthenticationService} from "../../providers/authentication-service";

/*
  Generated class for the ImageSelectionModalPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-image-selection-modal-page',
  templateUrl: 'image-selection-modal-page.html'
})
export class ImageSelectionModalPage {

  constructor(
    public navCtrl: NavController,
    private userAccountService: UserAccountService,
    private authenticationService: AuthenticationService,
    private toastController: ToastController
  ) {}

  ionViewDidLoad() {
    console.log('Hello ImageSelectionModalPage Page');
  }

  changeProfileImage(event){

    let image = event.srcElement.files[0];

    this.userAccountService.saveImage(image, ()=> {
      // state change events here
      console.log("uploading");
    }, ()=>{
      // error
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

      let toast = this.toastController.create({
        message: 'Uploaded an image successfully',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
      this.navCtrl.pop();
    });

  }

  selectProfileImage(){
    let selectField = document.getElementById("userImageField");
    selectField.click();
  }

}
