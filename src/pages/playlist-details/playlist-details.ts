import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SpotifyService } from '../../providers/spotify-service';

@Component({
  selector: 'page-playlist-details',
  templateUrl: 'playlist-details.html'
})
export class PlaylistDetails {
  playlist_id: string;
  playlist_title: string
  playlist: SpotifyService[];

  constructor(public navCtrl: NavController, private navParams: NavParams, private spotifyservice: SpotifyService) {
    this.playlist_id = navParams.get('playlist_id');
    this.playlist_title = navParams.get('playlist_title');
    spotifyservice.loadPlaylistContent(this.playlist_id).subscribe(playlist => {
      console.log(playlist);
  })

  }

}
