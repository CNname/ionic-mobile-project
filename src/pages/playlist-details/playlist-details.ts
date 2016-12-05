import { Component, ChangeDetectorRef, ViewChild} from '@angular/core';
import { NavController, NavParams, ActionSheetController} from 'ionic-angular';
import { SoundcloudService } from '../../providers/soundcloud-service';
import { Playlist } from '../../classes/Playlist.Class';
import { SpotifyService } from "../../providers/spotify-service";
import { Handling } from "../../namespaces/handling";
import { MusicService } from "../../providers/music-service";
import { MiniPlayer } from "../../components/miniplayer";
import { UserAccountService } from "../../providers/user-account-service";
import { Subscription } from "rxjs";
import { PlayerPage } from '../playerPage/playerPage'
import { Song } from '../../classes/Song.class'

@Component({
  selector: 'page-playlist-details',
  templateUrl: 'playlist-details.html'
})
export class PlaylistDetails {
  playlist: Playlist;
  pauseButton: boolean = false;
  referrer: string;
  private subscription: Subscription;
  tempMiniPlayerData: any;

  @ViewChild(MiniPlayer) miniPlayerDetails: MiniPlayer;

  constructor(
    private navParams: NavParams,
    private soundcloudService: SoundcloudService,
    public spotifyService: SpotifyService,
    public musicService: MusicService,
    public navCtrl: NavController,
    public actionSheetCtrl: ActionSheetController,
    public userAccountService: UserAccountService,
  ) {
    this.playlist = navParams.get('item');
    this.referrer = navParams.get('referrer');
    this.tempMiniPlayerData = navParams.get('miniPlayer');

    this.subscription = spotifyService.changeEvent$.subscribe(value => {
      console.log("moikkelis " + value);
      if (this.referrer === "spotify") {
          this.spotifyService.loadPlaylistById(this.playlist.getOwnerId(), this.playlist.getId()).subscribe(res => {
          this.playlist.setSongs(Handling.HandleJson.tracks(res.tracks.items, "playlist"));
        })
      }
    });

  }

  ngOnInit(){
    if (this.referrer === "spotify") {
      // spotify
      this.spotifyService.loadPlaylistById(this.playlist.getOwnerId(), this.playlist.getId()).subscribe(res => {
        this.playlist.setSongs(Handling.HandleJson.tracks(res.tracks.items, "playlist"));
      });
      this.miniPlayerDetails.setMiniPlayerData(
        this.tempMiniPlayerData.getPlaying(),
        this.tempMiniPlayerData.getPlayingPlaylist(),
        "spotify"
      );
    } else {
      // soundcloud
      this.miniPlayerDetails.setMiniPlayerData(
        this.tempMiniPlayerData.getPlaying(),
        this.tempMiniPlayerData.getPlayingPlaylist(),
        ""
      );
    }
  }

  ngOnDestroy(){
    //this.subscription.unsubscribe();
  }

  ionViewDidLoad(){

    console.log(this.navParams.get['miniPlayer']);
    console.log(this.navParams.get('referrer'));

  }

  openPlayerPage(item: Song){
    this.navCtrl.push(PlayerPage, {item: item, songs: this.playlist.getSongs(), referrer: this.referrer }).catch(()=> console.log('Error occured'));
  }

  ionViewWillLeave(){
    // param reference has to be used to update playing song in the parent view,
    // because currently Ionic 2 doesn't support pop with params feature
    this.navParams.get('miniPlayer').setMiniPlayerData(
      this.miniPlayerDetails.getPlaying(),
      this.miniPlayerDetails.getPlayingPlaylist(),
      this.referrer
    );
  }

  addToPlaylist(item){
    // Nothing
  }

  share(item){
      //nothing
  }

}
