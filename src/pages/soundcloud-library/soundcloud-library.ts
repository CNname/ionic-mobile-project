import { HostListener, Component, ViewChild } from '@angular/core';
import { NavController, ViewController, ToastController } from 'ionic-angular';
import { Song } from '../../classes/Song.class';
import { UserAccountService } from '../../providers/user-account-service'
import { User } from '../../classes/User.class'
import { SoundcloudService } from '../../providers/soundcloud-service'
import { Handling } from "../../namespaces/handling";
import { Playlist } from '../../classes/Playlist.Class'
import { PlaylistDetails } from '../playlist-details/playlist-details'
import {Observable} from 'rxjs/Rx';


@Component({
  selector: 'page-soundcloud-library',
  templateUrl: 'soundcloud-library.html'
})
export class SoundcloudLibrary {
    hideElement: boolean = false;
    playerNav: string = "home";
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
    trending: any[] = [];
    time: number = 0;
    timer: string = '00:00';
    numbers: any;
    minute:number = 0;

  constructor(public navCtrl: NavController,
    userAccountService: UserAccountService,
    soundcloudService: SoundcloudService,
    private toastController: ToastController) {
      this.userAccountService = userAccountService;
      this.soundcloudService = soundcloudService;
      this.soundcloudService.getCharts("top", encodeURIComponent("soundcloud:genres:"+"all-music")).subscribe(res =>{
        //console.log(res);
        this.trending = Handling.HandleJson.SoundCloudTrendingTracks(res.collection);
      });
      this.soundcloudService.getPlaylists().then(res =>{
        //console.log(res);
        this.playlists = Handling.HandleJson.SoundCloudPlaylists(res);
      });
  }

/*  @HostListener('ion-list-search:scroll', ['$event'])
     onScroll(event) {
       console.log("Scroll Event", document.body.scrollTop);
  }*/

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

  focusInput(input){
    this.timeout = setTimeout(() =>{
      input.setFocus();
    }, 500);
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
          let items: any[] = Handling.HandleJson.SoundCloudTracks(res.collection);
          for(let i= 0; i < items.length; i++){
            this.items.push(items[i]);
          }
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
    this.numbers.unsubscribe();
    this.soundcloudService.pauseStream();
  }

  startPlayer(){
    this.numbers = this.soundcloudService.timer().subscribe(x => this.showTime(x));
    this.soundcloudService.resumeStream();
  }

  startNewPlayer(item: Song){
    this.isPlaying = true;
    this.pauseButton = true;
    this.playing = item;
    this.soundcloudService.startStreaming(item.getId());
    this.numbers = this.soundcloudService.timer().subscribe(x => this.showTime(x));
  }

  showTime(x:number){
    this.time = x;
    if((( (this.time)-(this.minute*60) ) / 60) == 1){
      console.log('minute added');
      this.minute += 1;
    }

    if(this.minute < 1){
      if(this.time < 10){
          this.timer = '00:0'+this.time;
      }else{
        this.timer = '00:'+this.time;
      }

    }else if(this.minute >= 1 && this.minute < 10){
      if((this.time - (this.minute*60)) < 10){
        this.timer = '0'+this.minute+':0'+(this.time-(this.minute*60));
      }else if(((this.time) - (this.minute*60)) < 60){
        this.timer = '0'+this.minute+':'+(this.time-(this.minute*60));
      }

    }else if(this.minute >= 10){
      if((this.time - (this.minute*60)) < 10) {
        this.timer = this.minute+':0'+(this.time-(this.minute*60));
      }else if(((this.time) - (this.minute*60)) < 60) {
        this.timer = this.minute+':'+(this.time-(this.minute*60));
      }
    }
  }
}
