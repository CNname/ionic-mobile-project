import { Component, ViewChild } from '@angular/core';
import { NavController, ToastController, MenuController } from 'ionic-angular';
import { Song } from '../../classes/Song.class';
import { UserAccountService } from '../../providers/user-account-service';
//import { User } from '../../classes/User.class';
import { SoundcloudService } from '../../providers/soundcloud-service';
import { Handling } from "../../namespaces/handling";
import { Playlist } from '../../classes/Playlist.Class';
import { PlaylistDetails } from '../playlist-details/playlist-details';
import { PlayerPage } from '../playerPage/playerPage';
import { imageUrls } from "../../interfaces/interfaces";
import { MiniPlayer } from '../../components/miniplayer'

@Component({
  selector: 'page-soundcloud-library',
  templateUrl: 'soundcloud-library.html'
})
export class SoundcloudLibrary {
    hideElement: boolean = false;
    hideList: boolean = false;
    hideList2: boolean = false;
    playerNav: string = "trending";
    isPlaying: boolean = false;
    pauseButton: boolean = false;
    playing: Song;
    //private tracks: any[] = [];
    //private playTrack: number = 0;
    public currentTrack: Song;
    searchCategory: string;
    trackItems: any;
    artistItems: any[] = [];
    timeout: any;
    items: Playlist;
    playlists: any[] = [];
    //private user: User;
    next_href: string;
    tr_music_next_href:string;
    tr_audio_next_href:string;
    trending: Playlist;
    trendingAllAudio: Playlist;
    time: number = 0;

  @ViewChild(MiniPlayer) miniPlayer: MiniPlayer;

  constructor(public navCtrl: NavController,
    public userAccountService: UserAccountService,
    public soundcloudService: SoundcloudService,
    public menuCtrl: MenuController,
    private toastController: ToastController) {

    this.soundcloudService.getPlaylists().then(res =>{
        this.playlists = Handling.HandleJson.SoundCloudPlaylists(res);
    });
    this.items = new Playlist("searchPlaylist", "Search results", 0, "soundcloud");
    this.trending = new Playlist("searchPlaylist", "Trending", 0, "soundcloud");
    this.trendingAllAudio = new Playlist("searchPlaylist", "Trending", 0, "soundcloud");
  }

  ionViewWillLeave(){
    //this.soundcloudService.pauseStream();
  }

  loadCharts(category: string){

    this.soundcloudService.getCharts("top", encodeURIComponent("soundcloud:genres:"+category)).subscribe(res =>{
      if (category == 'all-music'){
          if(res.next_href) {
            this.tr_music_next_href = res.next_href;
          } else this.tr_music_next_href = "";
          let tracks = Handling.HandleJson.SoundCloudTrendingTracks(res);
          this.trending.setSongs(tracks);
          this.trending.setSongCount(tracks.length);
      }else if (category == 'all-audio'){
        if(res.next_href) {
           this.tr_audio_next_href = res.next_href;
         } else this.tr_audio_next_href = "";
         let tracks = Handling.HandleJson.SoundCloudTrendingTracks(res);
         this.trendingAllAudio.setSongCount(tracks.length);
         this.trendingAllAudio.setSongs(tracks);

      }
    });
  }

  loadMoreFromChart(category: string){

      if (category == 'all-music' && this.tr_music_next_href.length != 0){
        this.soundcloudService.getMore(this.tr_music_next_href).subscribe(res => {

          if(res.next_href){ this.tr_music_next_href = res.next_href;
          } else{ this.tr_music_next_href = ""; }

          let tracks = Handling.HandleJson.SoundCloudTrendingTracks(res);
          this.trending.setSongs(tracks);
          this.trending.setSongCount(tracks.length);
        });
      }else if(category == 'all-audio' && this.tr_audio_next_href.length != 0){
        this.soundcloudService.getMore(this.tr_music_next_href).subscribe(res => {

          if(res.next_href){ this.tr_audio_next_href = res.next_href;
          } else{ this.tr_audio_next_href = ""; }

          let tracks = Handling.HandleJson.SoundCloudTrendingTracks(res);
          this.trendingAllAudio.setSongs(tracks);
          this.trendingAllAudio.setSongCount(tracks.length);
        });
      }
  }

  login(){
    this.soundcloudService.login();
  }

  focusInput(input){
    this.timeout = setTimeout(() =>{
      input.setFocus();
    }, 500);
  }

  togglemenu(){
    if (this.playerNav === "home"){
      this.menuCtrl.open();
    }
  }

  doInfinite(infiniteScroll){
    if (this.playerNav === "search"){
      if(this.next_href.length != 0){
        this.soundcloudService.getMore(this.next_href).subscribe(res => {
          if(res.next_href){
            this.next_href = res.next_href;
            infiniteScroll.enable(true);
          }else{
            this.next_href = "";
            infiniteScroll.enable(false);
          }
          let tracks = this.items.getSongs();
          let items: any[] = Handling.HandleJson.SoundCloudTracks(res.collection);
          for(let i= 0; i < items.length; i++){
            tracks.push(items[i]);
          }
          this.items.setSongs(tracks);

        });
      } else{
        console.log('no more');
      }
    }
  }

  getItemsByName(event){
    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      let query:string = event.target.value;
      let founditems: any;
    //  if(this.next_href.length == 0){ query = event.target.value;
    //  } else { query = this.next_href; }
      if(query.length >= 3){
        // activate search segment if not active
        if (this.playerNav !== "search") this.playerNav = "search";
        this.soundcloudService.searchForItem(encodeURIComponent(query)).then(res => {
          console.log(res);
          if(res.next_href){
            this.next_href = res.next_href;
          }
          founditems = Handling.HandleJson.SoundCloudTracks(res.collection);
          this.items.setSongCount(founditems.length);
          this.items.setSongs(founditems);
        });
      }
      this.hideElement = false;
    }, 3000);

  }

  openPlaylist(item: Playlist){
    this.navCtrl.push(PlaylistDetails, {item: item, referrer: "soundcloud", miniPlayer: this.miniPlayer}).catch(()=> console.log('Something went wrong while opening playlist'));
  }
}
