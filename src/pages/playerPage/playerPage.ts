import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Song } from '../../classes/Song.class';
import { MusicService } from '../../providers/music-service';
import { IPlayer } from "../../interfaces/interfaces";
import { Playlist } from "../../classes/Playlist.Class";
import { SoundcloudService } from '../../providers/soundcloud-service'
import { imageUrls } from "../../interfaces/interfaces";

@Component({
  selector: 'playerPage',
  templateUrl: 'playerPage.html'
})
export class PlayerPage implements IPlayer {
  song: Song;
  songs: Playlist;
  referrer: string;
  isPlaying: boolean;
  index:number = 0;

  constructor(public navCtrl: NavController,
    private navParams: NavParams,
    public musicService: MusicService,
    public soundcloudService: SoundcloudService) {

      this.song = navParams.get('miniPlayer').getPlaying();
      this.songs = navParams.get('miniPlayer').getPlayingPlaylist();
        console.log(this.songs);
      this.referrer = navParams.get('miniPlayer').getReferrer();
      console.log(navParams.get('miniPlayer'));
      // Replace the playing songs album art to a bigger image
      if(this.referrer == 'soundcloud'){
        let images:imageUrls = this.song.getAlbumImage();
        images.large = images.large.replace('large.jpg', 't500x500.jpg');
        this.song.setAlbumImage(images);
      }

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
    if(this.referrer == 'spotify'){
      this.musicService.pausePlayback();
    }else if(this.referrer == 'soundcloud'){
      this.soundcloudService.pauseStream();
    }
  }

  startPlayback() {
    if(this.referrer == 'spotify'){
      this.musicService.startPlayback();
    }else if(this.referrer == 'soundcloud'){
      this.soundcloudService.resumeStream();
    }
  }

  previousSong(){
    let currentId = this.song.getId();
    let songs = this.songs.getSongs();
    //console.log(this.songs.getSongs());
    for (let i=0; i< songs.length; i++) {
      if (currentId === songs[i].getId()) {
        if(this.referrer == 'spotify'){
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
        } else if(this.referrer == 'soundcloud'){
            if (i === 0) {
              this.soundcloudService.startStreaming((songs[songs.length-1].getId()));
              this.song = songs[songs.length-1];
            } else {
              this.soundcloudService.startStreaming((songs[i-1].getId()));
              this.song = songs[i-1];
            }
            let images:imageUrls = this.song.getAlbumImage();
            images.large = images.large.replace('large.jpg', 't500x500.jpg');
            this.song.setAlbumImage(images);
        }
      }
    }
  }

  nextSong(){
    let currentId = this.song.getId();
    let songs = this.songs.getSongs();
    for (let i=0; i<songs.length; i++) {
      if (currentId === songs[i].getId()) {
        if(this.referrer == 'spotify'){
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
      }else if(this.referrer == 'soundcloud'){
        if (i === songs.length-1) {
          this.soundcloudService.startStreaming(songs[0].getId());
          this.song = songs[0];
        } else {
          this.soundcloudService.startStreaming(songs[i+1].getId());
          this.song = songs[i+1];
        }
        let images:imageUrls = this.song.getAlbumImage();
        images.large = images.large.replace('large.jpg', 't500x500.jpg');
        this.song.setAlbumImage(images);
      }
      }
    }
  }

  shuffle() {

  }

  checkPlaying():boolean{
      if(this.referrer == 'spotify'){
        return this.musicService.getStatus();
      }else if (this.referrer == 'soundcloud'){
        return this.soundcloudService.isPlaying();
      }
  }

}
