import { Component, ViewChild } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';

/*
  Generated class for the SoundcloudLibrary page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-soundcloud-library',
  templateUrl: 'soundcloud-library.html'
})
export class SoundcloudLibrary {
    playerNav: string = "feed";

  constructor(public navCtrl: NavController) {

  }

  ionViewDidLoad() {

  }

}
