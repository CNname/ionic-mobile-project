import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, ActionSheetController} from 'ionic-angular';
import {SpotifyService} from "../../providers/spotify-service";
import {Artist} from "../../classes/Artist.class";
import {Song} from "../../classes/Song.class";
import {Handling} from "../../namespaces/handling";
import {Playlist} from "../../classes/Playlist.Class";
import {MiniPlayer} from "../../components/miniplayer";
import {MusicService} from "../../providers/music-service";
import {SoundcloudService} from "../../providers/soundcloud-service";
import {UserAccountService} from "../../providers/user-account-service";

/*
  Generated class for the Artist page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-artist',
  templateUrl: 'artist-page.html'
})
export class ArtistPage {
  artist: Artist;
  popularTracks: Playlist;
  tempMiniPlayerData: any;

  @ViewChild(MiniPlayer) miniPlayer: MiniPlayer;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public spotifyService: SpotifyService,
    public musicService: MusicService,
    public soundcloudService: SoundcloudService,
    public userAccountService: UserAccountService,
    public actionSheetCtrl: ActionSheetController
  ) {
    this.tempMiniPlayerData = navParams.get('miniPlayer');
    this.artist = navParams.get("item");
  }

  ionViewDidLoad() {

    this.miniPlayer.setMiniPlayerData(
      this.tempMiniPlayerData.getPlaying(),
      this.tempMiniPlayerData.getPlayingPlaylist(),
      "spotify"
    );

    this.tempMiniPlayerData = undefined;

    this.getPopularSongs();

  }

  ionViewWillLeave(){
    // param reference has to be used to update playing song in the parent view,
    // because currently Ionic 2 doesn't support pop with params feature
    this.navParams.get('miniPlayer').setMiniPlayerData(
      this.miniPlayer.getPlaying(),
      this.miniPlayer.getPlayingPlaylist(),
      "spotify"
    );
  }

  getPopularSongs() {
    this.spotifyService.getPopularSongsByArtist(this.artist.getId()).subscribe((res) => {
      let popular: Array<Song> = Handling.HandleJson.tracks(res.tracks);

      // id: string, title: string, count: number, service: string
      this.popularTracks = new Playlist("Popular", "Popular songs of artist", popular.length, "spotify");
      this.popularTracks.setSongs(popular);

    })
  }

}
