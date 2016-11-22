import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the Loading page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-loading',
  templateUrl: 'loading.html'
})
export class Loading {

  loadingTexts: string[] = [
    "Setting up a nest...",
    "Cleaning up some bird poos...",
    "It's hatching!"
  ];

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello Loading Page');
  }

}
