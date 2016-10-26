import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Song } from '../../classes/Song.class';
import { MusicService } from '../../providers/music-service';
import { Library } from '../library/library';

@Component({
  selector: 'playerPage',
  templateUrl: 'playerPage.html'
})
export class PlayerPage {
    item: Song;
    public musicService: MusicService;

  constructor(public navCtrl: NavController, private navParams: NavParams, musicService: MusicService) {
    this.musicService = musicService;
    this.item = navParams.get('item');
  }
  ionViewDidLoad(){
    console.log("start of the page");
  }
  pausePlayback(){
    this.musicService.pausePlayback();
  }
  startPlayback(){
    this.musicService.startPlayback();
  }

}
