import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the Search page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class Search {

  constructor(public navCtrl: NavController, private navParams: NavParams) {
    
  }

  ionViewDidLoad() {
    console.log('Hello Search Page');
  }

}
