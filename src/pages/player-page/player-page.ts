import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SpotifyService } from '../../providers/spotify-service';
import { PlaylistDetails } from '../playlist-details/playlist-details';
//import { SongInterface } from '../../model/songinterface';

@Component({
  selector: 'page-player-page',
  templateUrl: 'player-page.html'
})
export class PlayerPage {
  // select the default tab
  playerNav: string = "playlists";
  playlist: SpotifyService[];
//  pl: SongInterface;
  playlist_id: string;
  playlist_title: string;
  playlist_length: number;
  playlist_owner: string;
  playlist_items: Array<Object>;


  constructor(public navCtrl: NavController, private spotifyservice: SpotifyService) {
    spotifyservice.loadPlaylist().subscribe(playlist => {
      //console.log(pl);
      this.playlist_items = playlist["items"];
      //console.log("tässä tää ois: "+this.pl.playlist_items);
    });
  }
  goToDetails(playlist_id: string, playlist_title: string) {
    this.navCtrl.push(PlaylistDetails, {playlist_id, playlist_title});
 }
}
