import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
//import { SpotifyService } from '../../providers/spotify-service';
import { Song } from '../../classes/Song.class';
import { MusicService } from '../../providers/music-service';
import { Library } from '../library/library';

@Component({
  selector: 'playerPage',
  templateUrl: 'playerPage.html'
})
export class PlayerPage {
    audioObject = null;
    url: string;
    item: Song;
    musicService: MusicService;

  constructor(public navCtrl: NavController, private navParams: NavParams, public viewCtrl: ViewController) {
    this.item = navParams.get('item');
    this.url = this.item.getUrl();
    this.startPlayback(this.url);
  }
  IonViewDidLoad(){
      console.log("only once");
  }
  pausePlayback(){
    this.musicService.pausePlayback();
  }

  startPlayback(url: string){
    this.musicService.resetAudio();
    this.musicService.setAudio(url);
    this.musicService.startPlayback();
  }

  setLoop(){}
  
  goBack(){
    console.log("go back was called");
    this.musicService.pausePlayback();
    this.musicService.resetAudio();
  }

}
