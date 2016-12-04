import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Song } from '../../classes/Song.class';
import { MusicService } from '../../providers/music-service';
import {IPlayer} from "../../interfaces/interfaces";
import {Playlist} from "../../classes/Playlist.Class";

@Component({
  selector: 'playerPage',
  templateUrl: 'playerPage.html'
})
export class PlayerPage implements IPlayer {
  song: Song;
  songs: Playlist;
  referrer: string;
  isPlaying: boolean;

  constructor(public navCtrl: NavController, private navParams: NavParams, public musicService: MusicService) {
    /*this.song = navParams.get('item');
    this.songs = navParams.get('songs');
    this.referrer = navParams.get('referrer');*/

    this.song = navParams.get('miniPlayer').getPlaying();
    this.songs = navParams.get('miniPlayer').getPlayingPlaylist();
    this.referrer = navParams.get('miniPlayer').getReferrer();

    console.log(navParams.get('miniPlayer'));

  }

  ionViewDidLoad(){
    console.log("start of the page");
  }

  ionViewWillLeave(){

    // param reference has to be used to update playing song in the parent view,
    // because currently Ionic 2 doesn't support pop with params feature
    this.navParams.get('miniPlayer').setMiniPlayerData(this.song, this.songs, this.referrer);

  }

  pausePlayback(){
    this.musicService.pausePlayback();
  }

  startPlayback() {
    this.musicService.startPlayback();
  }

  previousSong(){
    let currentId = this.song.getId();
    let songs = this.songs.getSongs();
    for (let i=0; i<songs.length; i++) {
      if (currentId === songs[i].getId()) {
        this.musicService.resetAudio();
        if (i === 0) {
          this.musicService.setAudio(songs[songs.length-1].getUrl());
          this.song = songs[songs.length-1];
        } else {
          this.musicService.setAudio(songs[i-1].getUrl());
          this.song = songs[i-1];
        }
        this.musicService.startPlayback();
        break;
      }
    }
  }

  nextSong(){
    let currentId = this.song.getId();
    let songs = this.songs.getSongs();
    for (let i=0; i<songs.length; i++) {
      if (currentId === songs[i].getId()) {
        this.musicService.resetAudio();
        if (i === songs.length-1) {
          this.musicService.setAudio(songs[0].getUrl());
          this.song = songs[0];
        } else {
          this.musicService.setAudio(songs[i+1].getUrl());
          this.song = songs[i+1];
        }
        this.musicService.startPlayback();
        break;
      }
    }
  }

  shuffle() {

  }

}
