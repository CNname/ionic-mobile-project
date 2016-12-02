import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SoundcloudService } from '../../providers/soundcloud-service';
import { Playlist } from '../../classes/Playlist.Class'
import { Song } from '../../classes/Song.class'
import {SpotifyService} from "../../providers/spotify-service";
import {Handling} from "../../namespaces/handling";
import {PlayerPage} from "../playerPage/playerPage";
import {MusicService} from "../../providers/music-service";

@Component({
  selector: 'page-playlist-details',
  templateUrl: 'playlist-details.html'
})
export class PlaylistDetails {
  playlist: Playlist;
  isPlaying: boolean = false;
  pauseButton: boolean = false;
  playing: Song;
  referrer: string;


  constructor(
    private navParams: NavParams,
    private soundcloudService: SoundcloudService,
    private spotifyService: SpotifyService,
    public musicService: MusicService,
    public navCtrl: NavController
  ) {
    this.playlist = navParams.get('item');
    this.referrer = navParams.get('referrer');
  }

  ngOnInit(){
    if (this.referrer === "spotify") {
      this.spotifyService.loadPlaylistById(this.playlist.getOwnerId(), this.playlist.getId()).subscribe(res => {
        console.log(res);
        this.playlist.setSongs(Handling.HandleJson.tracks(res.tracks.items, "playlist"));
      })
    }
  }

  pausePlayer(e: Event){
    if (this.referrer === "spotify") {
      e.stopPropagation();
      if(this.musicService.isPlayerInit()){
        this.musicService.pausePlayback();
      }
    } else {
      this.soundcloudService.pauseStream();
    }
  }
  startPlayer(e: Event){
    if (this.referrer === "spotify") {
      e.stopPropagation();
      if(this.musicService.isPlayerInit()){
        this.musicService.startPlayback();
      }
    } else {
      this.soundcloudService.resumeStream();
    }
  }
  startNewPlayer(item: Song){

    this.playing = item;
    this.isPlaying = true;
    this.pauseButton = true;

    if (this.referrer === "spotify") {
      if (this.musicService.isPlayerInit()) {
        this.musicService.pausePlayback();
        this.musicService.resetAudio();
        this.musicService.setAudio(item.getUrl());
        this.musicService.startPlayback();
      } else {
        this.musicService.setAudio(item.getUrl());
        this.musicService.startPlayback();
      }
    } else {
      this.soundcloudService.startStreaming(item.getId());
    }
  }

  openPlayerPage(item: Song){
    this.navCtrl.push(PlayerPage, {item: item, songs: this.playlist.getSongs(), referrer: this.referrer }).catch(()=> console.log('Error occured'));
  }

  addToPlaylist(item){
    // Nothing
  }

  share(item){
      //nothing
  }

}
