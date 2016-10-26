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
    tracks: Song[];
    public musicService: MusicService;

  constructor(public navCtrl: NavController, private navParams: NavParams, musicService: MusicService) {
    this.musicService = musicService;
    this.item = navParams.get('item');
    this.tracks = navParams.get('songs');
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
  previousSong(){
    let currentId = this.item.getId();
    for (let i=0; i<this.tracks.length; i++) {
      if (currentId === this.tracks[i].getId()) {
        this.musicService.resetAudio();
        if (i === 0) {
          this.musicService.setAudio(this.tracks[this.tracks.length-1].getUrl());
          this.item = this.tracks[this.tracks.length-1];
        } else {
          this.musicService.setAudio(this.tracks[i-1].getUrl());
          this.item = this.tracks[i-1];
        }
        this.musicService.startPlayback();
        break;
      }
    }
  }
  nextSong(){
    let currentId = this.item.getId();
    for (let i=0; i<this.tracks.length; i++) {
      if (currentId === this.tracks[i].getId()) {
        this.musicService.resetAudio();
        if (i === this.tracks.length-1) {
          this.musicService.setAudio(this.tracks[0].getUrl());
          this.item = this.tracks[0];
        } else {
          this.musicService.setAudio(this.tracks[i+1].getUrl());
          this.item = this.tracks[i+1];
        }
        this.musicService.startPlayback();
        break;
      }
    }
  }


}
