import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Song } from '../../classes/Song.class';
import { MusicService } from '../../providers/music-service';
import { Library } from '../library/library';
import {IPlayer} from "../../interfaces/interfaces";

@Component({
  selector: 'playerPage',
  templateUrl: 'playerPage.html'
})
export class PlayerPage implements IPlayer {
  song: Song;
  songs: Song[];
  public musicService: MusicService;

  constructor(public navCtrl: NavController, private navParams: NavParams, musicService: MusicService) {
    this.musicService = musicService;
    this.song = navParams.get('item');
    this.songs = navParams.get('songs');
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
    let currentId = this.song.getId();
    for (let i=0; i<this.songs.length; i++) {
      if (currentId === this.songs[i].getId()) {
        this.musicService.resetAudio();
        if (i === 0) {
          this.musicService.setAudio(this.songs[this.songs.length-1].getUrl());
          this.song = this.songs[this.songs.length-1];
        } else {
          this.musicService.setAudio(this.songs[i-1].getUrl());
          this.song = this.songs[i-1];
        }
        this.musicService.startPlayback();
        break;
      }
    }
  }

  nextSong(){
    let currentId = this.song.getId();
    for (let i=0; i<this.songs.length; i++) {
      if (currentId === this.songs[i].getId()) {
        this.musicService.resetAudio();
        if (i === this.songs.length-1) {
          this.musicService.setAudio(this.songs[0].getUrl());
          this.song = this.songs[0];
        } else {
          this.musicService.setAudio(this.songs[i+1].getUrl());
          this.song = this.songs[i+1];
        }
        this.musicService.startPlayback();
        break;
      }
    }
  }

  shuffle() {

  }

}
