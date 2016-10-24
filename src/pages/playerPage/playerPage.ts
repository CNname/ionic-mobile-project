import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SpotifyService } from '../../providers/spotify-service';
import { Song } from '../../classes/Song.class';


@Component({
  selector: 'playerPage',
  templateUrl: 'playerPage.html'
})
export class PlayerPage {
    audioObject = null;
    url: string;
    item: Song;

  constructor(public navCtrl: NavController, private navParams: NavParams) {
    this.item = navParams.get('item');
    this.url = this.item.getUrl();
    
    if(this.url.length > 0 && this.audioObject == null ){
        this.audioObject = new Audio(this.url);
    }
    this.startPlayback();
    console.log(this.item);
  }

  pausePlayback(){
    this.audioObject.pause();
  }

  startPlayback(){
    this.audioObject.play();
  }

  setLoop(){
    if(this.audioObject.loop == false){
        this.audioObject.loop = true;
    }else{
      this.audioObject.loop = false;
    }
  }
}
