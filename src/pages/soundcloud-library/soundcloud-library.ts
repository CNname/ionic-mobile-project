import { Component, ViewChild } from '@angular/core';
import { NavController, ViewController, ToastController } from 'ionic-angular';
import { Song } from '../../classes/Song.class';
import { UserAccountService } from '../../providers/user-account-service'
import { User } from '../../classes/User.class'
import { SoundcloudService } from '../../providers/soundcloud-service'
import { Handling } from "../../namespaces/handling";
import { Playlist } from '../../classes/Playlist.Class'
import { PlaylistDetails } from '../playlist-details/playlist-details'


@Component({
  selector: 'page-soundcloud-library',
  templateUrl: 'soundcloud-library.html'
})
export class SoundcloudLibrary {
    hideElement: boolean = false;
    playerNav: string = "feed";
    isPlaying: boolean = false;
    pauseButton: boolean = false;
    playing: Song;
    private tracks: any[] = [];
    private playTrack: number = 0;
    public currentTrack: Song;
    searchCategory: string;
    trackItems: any;
    artistItems: any[] = [];
    timeout: any;
    items: any[] = [];
    playlists: any[] = [];
    private userAccountService: UserAccountService;
    private soundcloudService: SoundcloudService;
    private user: User;

  constructor(public navCtrl: NavController, userAccountService: UserAccountService, soundcloudService: SoundcloudService, private toastController: ToastController) {
      this.userAccountService = userAccountService;
      this.soundcloudService = soundcloudService;
      /*this.soundcloudService.getCharts("asd", "asd").subscribe(res =>{
        console.log(res);
      });*/
      this.soundcloudService.getPlaylists().then(res =>{
          this.playlists = Handling.HandleJson.SoundCloudPlaylists(res);
      });
  }

  /*ionViewCanEnter(): boolean{
    this.user = this.userAccountService.getCurrentUser();
    if(this.user.getSoundCloudAccountId() == null){
      //console.log(this.user.getId());
      let toast = this.toastController.create({
        message: 'You must first sign in to SoundCloud, you can do this in the settings',
        duration: 5000,
        position: 'bottom'
      });
      toast.present();
      return false;
    } else { return true; }

  }*/

  ionViewWillLeave(){
    //this.soundcloudService.pauseStream();
  }

  getItemsByName(event){
    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {

      let query = event.target.value;

      if(query.length >= 3){
        // activate search segment if not active
        if (this.playerNav !== "search") this.playerNav = "search";
        this.soundcloudService.searchForItem(encodeURIComponent(query)).then(res => {
            this.items = Handling.HandleJson.SoundCloudTracks(res);
        });
      }
    }, 3000);
  }



  openPlaylist(item: Playlist){
    this.navCtrl.push(PlaylistDetails, {item: item}).catch(()=> console.log('Something went wrong while opening playlist'));
  }

  openPlayer(){
    console.log('player');
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
}
