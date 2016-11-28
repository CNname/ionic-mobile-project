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
    next_href: string;

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
  // this does not work..
  focusInput(input){
    this.timeout = setTimeout(() =>{
      input.setFocus();
    }, 500);
    //console.log(input);
  }

  doInfinite(infiniteScroll){
    //console.log("end of a list, call more");
    if(this.next_href.length != 0){
      //console.log(this.next_href);
      this.soundcloudService.getMore(this.next_href).subscribe(res => {
        if(res.next_href){
          this.next_href = res.next_href;
          infiniteScroll.enable(true);
        }else{
          this.next_href = "";
          infiniteScroll.enable(false);
        }
        let items: any[] = Handling.HandleJson.SoundCloudTracks(res.collection);
        for(let i= 0; i < items.length; i++){
          this.items.push(items[i]);
        }
        //console.log(this.items);
      });
    } else{
      console.log('no more');
    }
  }

  getItemsByName(event){
    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      let query:string = event.target.value;

    //  if(this.next_href.length == 0){ query = event.target.value;
    //  } else { query = this.next_href; }

      if(query.length >= 3){
        // activate search segment if not active
        if (this.playerNav !== "search") this.playerNav = "search";
        this.soundcloudService.searchForItem(encodeURIComponent(query)).then(res => {
          //console.log(res);
          if(res.next_href){
            this.next_href = res.next_href;
          }
          this.items = Handling.HandleJson.SoundCloudTracks(res.collection);
        });
      }
    }, 3000);
  }



  openPlaylist(item: Playlist){
    this.navCtrl.push(PlaylistDetails, {item: item}).catch(()=> console.log('Something went wrong while opening playlist'));
  }

  openPlayerPage(item){
    //console.log('player');
  }

  pausePlayer(){
    this.soundcloudService.pauseStream();
  }

  startPlayer(){
    this.soundcloudService.resumeStream();
  }

  startNewPlayer(item: Song){
    this.isPlaying = true;
    this.pauseButton = true;
    this.playing = item;
    this.soundcloudService.startStreaming(item.getId());

  }
}
