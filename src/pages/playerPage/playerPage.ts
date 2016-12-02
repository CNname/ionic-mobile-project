import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Song } from '../../classes/Song.class';
import { MusicService } from '../../providers/music-service';
import {IPlayer} from "../../interfaces/interfaces";

@Component({
  selector: 'playerPage',
  templateUrl: 'playerPage.html'
})
export class PlayerPage implements IPlayer {
  song: Song;
  songs: Song[];
  referrer: string;
  isPlaying: boolean;

  constructor(public navCtrl: NavController, private navParams: NavParams, public musicService: MusicService) {
    this.song = navParams.get('item');
    this.songs = navParams.get('songs');
    this.referrer = navParams.get('referrer');

    console.log(this.songs);

  }

  ionViewDidLoad(){
    console.log("start of the page");
  }

  ionViewWillLeave(){

    // param reference has to be used to update playing song in the parent view,
    // because currently Ionic 2 doesn't support pop with params feature
    this.navParams.get('item').setId(this.song.getId());
    this.navParams.get('item').setAlbumId(this.song.getAlbumId());
    this.navParams.get('item').setSongTitle(this.song.getSongTitle());
    this.navParams.get('item').setAlbumImage(this.song.getAlbumImage());
    this.navParams.get('item').setArtists(this.song.getArtists());
    this.navParams.get('item').setDuration(this.song.getDuration());
    this.navParams.get('item').setIsPlayable(this.song.getIsPlayable());
    this.navParams.get('item').setUrl(this.song.getUrl());
  }

  pausePlayback(){
    this.musicService.pausePlayback();
  }

  startPlayback() {
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
