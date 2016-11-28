import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SoundcloudService } from '../../providers/soundcloud-service';
import { Playlist } from '../../classes/Playlist.Class'
import { Song } from '../../classes/Song.class'
import {SpotifyService} from "../../providers/spotify-service";

@Component({
  selector: 'page-playlist-details',
  templateUrl: 'playlist-details.html'
})
export class PlaylistDetails {
  playlist: Playlist;
  isPlaying: boolean = false;
  pauseButton: boolean = false;
  playing: Song;


  constructor(
    private navParams: NavParams,
    private soundcloudService: SoundcloudService,
    private spotifyService: SpotifyService
  ) {

    this.playlist = navParams.get('item');
    /*spotifyservice.loadPlaylistContent(this.playlist_id).subscribe(playlist => {
      console.log(playlist);
  })*/
  }
  pausePlayer(){
    this.soundcloudService.pauseStream();
  }
  resumePlayer(){
    this.soundcloudService.resumeStream();
  }
  startNewPlayer(item: Song){
    this.isPlaying = true;
    this.pauseButton = true;
    this.playing = item;
    this.soundcloudService.startStreaming(item.getId());
  }

  addToPlaylist(item){
    // Nothing
  }

  openPlayer(){
    //nothing
  }

  share(item){
      //nothing
  }

}
