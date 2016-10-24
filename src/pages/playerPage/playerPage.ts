import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SpotifyService } from '../../providers/spotify-service';


@Component({
  selector: 'playerPage',
  templateUrl: 'playerPage.html'
})
export class PlayerPage {
    audioObject = null;
    url: string;
    item: Object;

  constructor(public navCtrl: NavController, private navParams: NavParams) {
    this.url = navParams.get('url');
    this.item = navParams.get('item');
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
